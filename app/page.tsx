'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  getOrganization,
  getActiveScripture,
  getSlideImages,
  getFacilities,
  Organization,
  Scripture,
  SlideImage,
  Facility
} from '../lib/supabase';
import ImageSlider from '../components/ImageSlider';
import OrganizationChart from '../components/OrganizationChart';
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Group,
  ThemeIcon,
  Button,
  Modal,
  Image,
  Stack,
  Center,
  Loader,
  Box,
  ActionIcon,
  Paper,
  Drawer,
  Burger,
  Divider
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

// Animation wrapper component
function FadeInUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [scripture, setScripture] = useState<Scripture | null>(null);
  const [slides, setSlides] = useState<SlideImage[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Modals state
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [openedFacility, { open: openFacility, close: closeFacility }] = useDisclosure(false);
  const [openedSchedule, { open: openSchedule, close: closeSchedule }] = useDisclosure(false);
  const [openedMenu, { toggle: toggleMenu, close: closeMenu }] = useDisclosure(false);

  useEffect(() => {
    // Force scroll to top on load/refresh
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }

    setIsClient(true);
    loadData();
  }, []);

  useEffect(() => {
    if (selectedFacility) {
      openFacility();
    }
  }, [selectedFacility, openFacility]);

  const loadData = async () => {
    try {
      const [orgData, scriptureData, slideData, facilityData] = await Promise.all([
        getOrganization(),
        getActiveScripture(),
        getSlideImages(),
        getFacilities()
      ]);
      setOrganizations(orgData);
      setScripture(scriptureData);
      setSlides(slideData);
      setFacilities(facilityData);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
      // Fallback data
      setOrganizations([
        {
          id: 1, name: "임원", description: "예닮부를 섬기는 임원진", order_index: 1, created_at: "", updated_at: "", members: [
            { name: "김철수", role: "회장", image_url: "" },
            { name: "이영희", role: "부회장", image_url: "" }
          ]
        }
      ]);
      setScripture({
        id: 1,
        verse: "사랑하는 자들아 우리가 서로 사랑하자 사랑은 하나님께 속한 것이니 (요일 4:7)",
        reference: "요한일서 4장 7절",
        description: "이번 주 암송 구절입니다",
        is_active: true, created_at: "", updated_at: ""
      });
      setSlides([
        { id: 1, title: "환영합니다", image_url: "https://placehold.co/1200x600/eebefa/white?text=Welcome", description: "환영이미지", order_index: 1, is_active: true, created_at: "", updated_at: "" }
      ]);
      setFacilities([
        { id: 1, name: "1층 유년부실", description: "예배 및 조별모임 장소", image_url: "https://placehold.co/600x400", order_index: 1, is_active: true, created_at: "", updated_at: "" },
        { id: 2, name: "3층 모자실", description: "자녀와 함께 예배드리는 곳", image_url: "https://placehold.co/600x400", order_index: 2, is_active: true, created_at: "", updated_at: "" },
        { id: 3, name: "식당", description: "맛있는 점심 식사", image_url: "https://placehold.co/600x400", order_index: 3, is_active: true, created_at: "", updated_at: "" },
        { id: 4, name: "주차장", description: "넓은 주차 공간", image_url: "https://placehold.co/600x400", order_index: 4, is_active: true, created_at: "", updated_at: "" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="white" pb={120} style={{ wordBreak: 'keep-all', fontFamily: 'var(--font-geist-sans)' }}>
      {/* Navigation / Header */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
      >
        <Container size="xl" h={80} className="flex items-center justify-between">
          <Link href="/" className="no-underline group">
            <Group gap="xs">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center text-white font-serif italic text-lg shadow-sm group-hover:shadow-md transition-all duration-300">Y</div>
              <Text fw={600} size="lg" c="dark.9" style={{ letterSpacing: '-0.5px' }}>예닮부</Text>
            </Group>
          </Link>

          <Group gap="xl" visibleFrom="sm">
            {[
              { label: '소개', id: 'intro' },
              { label: '주요활동', id: 'activities' },
              { label: '조직도', id: 'organization' },
              { label: '시설안내', id: 'facilities' },
            ].map((item) => (
              <Text
                key={item.id}
                component="a"
                href={`#${item.id}`}
                size="sm"
                fw={500}
                c="gray.7"
                className="hover:text-black transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {item.label}
              </Text>
            ))}
            <Button variant="light" color="lime" size="xs" radius="xl" onClick={openSchedule}>
              예배시간표
            </Button>
          </Group>

          <Group hiddenFrom="sm">
            <Burger opened={openedMenu} onClick={toggleMenu} size="sm" />
            <Drawer
              opened={openedMenu}
              onClose={closeMenu}
              position="right"
              size="xs"
              title={<Text fw={700} size="lg">메뉴</Text>}
            >
              <Stack gap="md" mt="md">
                {[
                  { label: '소개', id: 'intro' },
                  { label: '주요활동', id: 'activities' },
                  { label: '조직도', id: 'organization' },
                  { label: '시설안내', id: 'facilities' },
                ].map((item) => (
                  <Text
                    key={item.id}
                    component="a"
                    href={`#${item.id}`}
                    size="md"
                    fw={500}
                    c="dark"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                      closeMenu();
                    }}
                  >
                    {item.label}
                  </Text>
                ))}
                <Divider my="sm" />
                <Button variant="light" color="lime" fullWidth radius="md" onClick={() => {
                  openSchedule();
                  closeMenu();
                }}>
                  예배시간표 보기
                </Button>

                <Link
                  href="/admin"
                  className="text-center text-gray-400 hover:text-gray-600 text-xs py-2 transition-colors mt-auto"
                  onClick={() => closeMenu()}
                >
                  관리자 페이지
                </Link>
              </Stack>
            </Drawer>
          </Group>
        </Container>
      </motion.nav>

      {/* Hero Section */}
      <Box pt={80}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <ImageSlider slides={slides} />
        </motion.div>
      </Box>

      {/* Intro Section */}
      <Container size="md" py={{ base: 80, md: 120 }} id="intro">
        <FadeInUp>
          <Stack align="center" gap="xl">
            <Text
              variant="gradient"
              gradient={{ from: 'lime.5', to: 'green.6', deg: 45 }}
              fz={{ base: 30, md: 54 }}
              fw={800}
              ta="center"
              style={{ letterSpacing: '-1.5px', lineHeight: 1.15, filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))' }}
            >
              예수님을 닮아가는<br />
              아름다운 부부 공동체
            </Text>

            <Box w={60} h={4} bg="black" my="md" />

            <Text c="dimmed" size="xl" ta="center" lh={1.8} maw={600} fz={{ base: 'md', md: 'xl' }}>
              장전제일교회 예닮부는 부부가 함께 신앙 안에서 성장하며
              서로를 세워가는 따뜻한 공동체입니다.
            </Text>
          </Stack>
        </FadeInUp>
      </Container>


      {/* ... (Middle sections omitted for brevity in search replacement, but effectively I need to target the Modal at the bottom and the Intro at the top. I'll split this if needed, but the file is small enough I might just target specific blocks if I can unique identify them. Actually, let's stick to doing 2 edits if they are far apart, or I'll use the replace tool carefully.) */}


      <Modal
        opened={openedSchedule}
        onClose={closeSchedule}
        centered
        size="lg"
        radius="xl"
        withCloseButton={false}
        padding={0}
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
        <Paper p="xl" radius="xl" bg="white" h="80vh" style={{ display: 'flex', flexDirection: 'column' }}>
          <Group justify="space-between" mb="lg" flex={0}>
            <Title order={3} fw={700}>전체 예배 시간표</Title>
            <ActionIcon onClick={closeSchedule} variant="subtle" color="gray" size="lg">
              <i className="ri-close-line text-2xl"></i>
            </ActionIcon>
          </Group>

          <Box style={{ flex: 1, overflowY: 'auto' }} pr="sm">
            <Stack gap="xl" style={{ wordBreak: 'keep-all' }}>
              {/* Sunday Worship */}
              <Box>
                <Text fw={700} c="green.7" mb="sm" size="lg">주일 예배</Text>
                <Stack gap="xs">
                  {[
                    { time: '오전 09:30', title: '1부 예배', location: '본당(본관 2층)', icon: '☀️' },
                    { time: '오전 11:30', title: '2부 예배', location: '본당(본관 2층)', icon: '⛪' },
                    { time: '오후 2:00', title: '달리다굼부 (장애인부)', location: '쉴만한물가(본관 1층)', icon: '🌅' },
                    { time: '오후 2:00', title: '예닮부 (청년부부) 예배 및 모임', location: '유년부실(본관 1층)', icon: '예닮부' },
                    { time: '오후 3:30', title: '3부 예배', location: '본당(본관 2층)', icon: '🌅' },
                  ].map((item, i) => (
                    <div key={i} className={`p-4 rounded-xl mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${item.icon === '예닮부' ? 'bg-green-50' : 'bg-gray-50'}`}>
                      <div className="flex flex-col gap-1">
                        <Text fw={800} size="sm" c="dark.9">{item.time}</Text>
                        <Text fw={600} size="md" c="dark.7">{item.title}</Text>
                        <Text size="sm" c="dimmed" className="sm:hidden">{item.location}</Text>
                      </div>
                      <Text size="sm" c="dimmed" className="hidden sm:block text-right">{item.location}</Text>
                    </div>
                  ))}
                </Stack>
              </Box>

              {/* Weekday Worship */}
              <Box>
                <Text fw={700} c="green.7" mb="sm" size="lg">주중 예배</Text>
                <Stack gap="xs">
                  {[
                    { time: '매일 새벽 05:30', title: '새벽예배', location: '본당(본관 2층)', icon: '🙏' },
                    { time: '수요 저녁 07:00', title: '수요예배', location: '본당(본관 2층)', icon: '📖' },
                    { time: '금요 저녁 09:00', title: '금요기도회(하열밤)', location: '본당(본관 2층)', icon: '🔥' },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-gray-50">
                      <div className="flex flex-col gap-1">
                        <Text fw={800} size="sm" c="dark.9">{item.time}</Text>
                        <Text fw={600} size="md" c="dark.7">{item.title}</Text>
                        <Text size="sm" c="dimmed" className="sm:hidden">{item.location}</Text>
                      </div>
                      <Text size="sm" c="dimmed" className="hidden sm:block text-right">{item.location}</Text>
                    </div>
                  ))}
                </Stack>
              </Box>

              {/* Church School */}
              <Box>
                <Text fw={700} c="green.7" mb="sm" size="lg">주일 학교</Text>
                <Stack gap="xs">
                  {[
                    { time: '오전 09:30', title: '청소년부 (중학교, 고등학교, 14~19세)', location: '교육관 (3층)' },
                    { time: '오전 11:30', title: '초등부 (초등학교 4~6학년, 11~13세)', location: '교육관 (3층)' },
                    { time: '오전 11:30', title: '유년부 (초등학교 1~3학년, 8~10세)', location: '유년부실' },
                    { time: '오전 11:30', title: '유치부 (4~7세)', location: '유치부실' },
                    { time: '오후 02:00', title: '청년연합예배', location: '본당(본관 2층)' },
                    { time: '오후 03:30', title: '청년1부 (늘사랑, 20~26세)', location: '드림하우스 (6층)' },
                    { time: '오후 03:30', title: '청년2부 (갈렙, 27세 이상 미혼청년)', location: '3예배실(본관지하1층)' },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-gray-50">
                      <div className="flex flex-col gap-1">
                        <Text fw={800} size="sm" c="dark.9">{item.time}</Text>
                        <Text fw={600} size="md" c="dark.7" lh={1.3}>{item.title}</Text>
                        <Text size="sm" c="dimmed" className="sm:hidden">{item.location}</Text>
                      </div>
                      <Text size="sm" c="dimmed" className="hidden sm:block text-right">{item.location}</Text>
                    </div>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Modal>


      {/* Major Activities */}
      <Box bg="gray.0" py={{ base: 80, md: 120 }} id="activities">
        <Container size="xl">
          <FadeInUp>
            <Group justify="space-between" mb={{ base: 40, md: 60 }} align="end">
              <Title order={2} fz={{ base: 24, md: 32 }} fw={700} style={{ letterSpacing: '-1px' }}>주요 활동</Title>
              <Text c="dimmed" fz="sm">함께하는 즐거움이 있습니다</Text>
            </Group>
          </FadeInUp>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing={{ base: 20, md: 40 }}>
            {/* Main Activity Card - Spans 2 cols on mobile (full width), 1 col on desktop (tall) */}
            <FadeInUp delay={0.1}>
              <Paper
                p={{ base: 30, md: 40 }}
                radius="xl"
                h="100%"
                className="group hover:-translate-y-2 transition-transform duration-500 ease-out h-full flex flex-col"
                style={{
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                  boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)'
                }}
              >
                <div className="flex-1">
                  <ThemeIcon size={60} radius="xl" color="dark" variant="filled" mb="xl">
                    <span style={{ fontSize: '28px' }}>📅</span>
                  </ThemeIcon>
                  <Text fz={{ base: 20, md: 24 }} fw={700} mb="md">예배 및 조별모임</Text>
                  <Text c="dimmed" lh={1.6} mb="xl" fz={{ base: 'sm', md: 'md' }}>
                    매주 주일 2부 예배 후,<br />
                    같은 나이대의 부부들이 모여<br />
                    삶과 신앙을 나눕니다.
                  </Text>
                </div>

                <Stack gap="xs" mt="auto">
                  <Group c="dimmed" gap="xs">
                    <i className="ri-map-pin-line"></i>
                    <Text size="sm">1층 유년부실</Text>
                  </Group>
                  <Group c="dimmed" gap="xs">
                    <i className="ri-time-line"></i>
                    <Text size="sm">주일 오후 2시</Text>
                  </Group>
                </Stack>
              </Paper>
            </FadeInUp>

            {/* Grid for Smaller Cards: 2 cols on mobile, 2 cols on desktop (occupying the remaining 2/3 width) */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 md:col-span-2">
              {[
                { icon: '🏠', title: '가정예배', desc: '가정 세우기', fullDesc: '믿음의 가정 세우기', color: 'green.1' },
                { icon: '🙏', title: '기도모임', desc: '중보기도', fullDesc: '형제, 자매별 중보기도', color: 'grape.1' },
                { icon: '🤝', title: '세겹줄', desc: '깊은 교제', fullDesc: '소그룹별 깊은 교제', color: 'orange.1' },
                { icon: '⛪', title: '아웃리치', desc: '섬김 활동', fullDesc: '지역교회 섬김 활동', color: 'pink.1' }
              ].map((item, i) => (
                <FadeInUp key={i} delay={0.2 + (i * 0.1)}>
                  <Paper
                    p={{ base: 'md', md: 'xl' }}
                    radius="xl"
                    bg="white"
                    h="100%"
                    className="hover:shadow-lg transition-shadow duration-300 flex flex-col justify-center items-center text-center md:items-start md:text-left"
                    style={{ border: '1px solid #f1f3f5' }}
                  >
                    <ThemeIcon
                      size={48}
                      radius="xl"
                      bg={item.color}
                      c="dark"
                      mb={{ base: 'xs', md: 'md' }}
                      className="md:self-start"
                    >
                      <span style={{ fontSize: '20px' }}>{item.icon}</span>
                    </ThemeIcon>
                    <Box>
                      <Text fw={600} size="lg" mb={{ base: 0, md: 4 }} style={{ wordBreak: 'keep-all' }}>{item.title}</Text>
                      {/* Mobile: Short Desc, Desktop: Full Desc */}
                      <Text size="sm" c="dimmed" visibleFrom="md">{item.fullDesc}</Text>
                      <Text size="xs" c="dimmed" hiddenFrom="md">{item.desc}</Text>
                    </Box>
                  </Paper>
                </FadeInUp>
              ))}
            </div>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Scripture Section - Parallax style */}
      {scripture && (
        <FadeInUp>
          <Box py={160} bg="dark.9" pos="relative" style={{ overflow: 'hidden' }}>
            <Box className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
                backgroundSize: '100px'
              }}
            />
            <Container size="md" pos="relative" style={{ zIndex: 1 }}>
              <Stack align="center" gap="xl">
                <Text c="gray.5" fz="sm" fw={600} tt="uppercase" style={{ letterSpacing: '4px' }}>THEME VERSE</Text>
                <Text
                  c="white"
                  ta="center"
                  fz={{ base: 24, md: 36 }}
                  fw={300}
                  lh={1.6}
                  style={{ fontFamily: 'serif', fontStyle: 'italic' }}
                >
                  "{scripture.verse}"
                </Text>
                <Text c="dimmed">({scripture.reference})</Text>
              </Stack>
            </Container>
          </Box>
        </FadeInUp>
      )}

      {/* Organization Chart */}
      <Container size="xl" py={120} id="organization">
        <FadeInUp>
          <Stack align="center" mb={80}>
            <Title order={2} fz={32} fw={700} style={{ letterSpacing: '-1px' }}>조직도</Title>
            <Text c="dimmed">예닮부를 섬기는 임원 및 리더</Text>
          </Stack>
        </FadeInUp>

        {loading ? (
          <Center py="xl">
            <Loader color="green" type="dots" size="xl" />
          </Center>
        ) : (
          <OrganizationChart organizations={organizations} />
        )}
      </Container>


      {/* Facilities - Gallery Style */}
      <Box bg="gray.0" py={120} id="facilities">
        <Container size="xl">
          <FadeInUp>
            <Group justify="space-between" mb={60} align="end">
              <Box>
                <Title order={2} fz={32} fw={700} style={{ letterSpacing: '-1px' }}>시설 안내</Title>
                <Text c="dimmed" mt="xs">더 나은 예배 환경을 제공합니다</Text>
              </Box>
            </Group>
          </FadeInUp>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
            {facilities.map((facility, index) => (
              <FadeInUp key={facility.id} delay={index * 0.1}>
                <Box
                  className="group relative cursor-default overflow-hidden rounded-2xl"
                  h={{ base: 240, md: 320 }}
                >
                  <Image
                    src={facility.image_url || 'https://placehold.co/400x600'}
                    alt={facility.name}
                    h="100%"
                    w="100%"
                    fit="cover"
                    className="md:group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  {/* Overlay: Always visible on mobile, hover on desktop */}
                  <Box className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />

                  <Box className="absolute bottom-0 left-0 p-6 w-full transform translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-transform duration-300">
                    <Text c="white" fw={700} fz="lg" mb={4}>{facility.name}</Text>
                    <Text
                      c="gray.3"
                      fz="sm"
                      lineClamp={2}
                      className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-100"
                    >
                      {facility.description}
                    </Text>
                  </Box>
                </Box>
              </FadeInUp>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Worship Schedule Banner */}
      <Container size="md" py={{ base: 80, md: 120 }}>
        <FadeInUp>
          <Paper radius="xl" bg="dark" p={{ base: 'xl', md: 60 }} pos="relative" style={{ overflow: 'hidden' }}>
            <Box className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 hidden md:block" />
            <Box className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -ml-32 -mb-32 hidden md:block" />

            <Stack align="center" gap="lg" pos="relative" style={{ zIndex: 1 }}>
              <Text c="white" fw={800} fz={{ base: 24, md: 32 }}>예배 순서가 궁금하신가요?</Text>
              <Text c="gray.4" ta="center" fz={{ base: 'sm', md: 'md' }}>장전제일교회 전체 예배 시간표를 확인하세요</Text>
              <Button
                variant="white"
                color="dark"
                size="md"
                radius="xl"
                onClick={openSchedule}
                rightSection={<i className="ri-arrow-right-line"></i>}
              >
                예배 시간표 보기
              </Button>
            </Stack>
          </Paper>
        </FadeInUp>
      </Container>

      {/* Footer - Minimal */}
      <Box component="footer" py={80} bg="white" style={{ borderTop: '1px solid #f1f3f5' }}>
        <Container size="lg">
          <Center>
            <Stack gap="xs" align="center">
              <Text fw={700} fz="xl" style={{ letterSpacing: '-1px' }}>장전제일교회</Text>
              <Text c="dimmed" size="sm">부산광역시 금정구 금정로 50 (장전동)</Text>

              <Group gap="lg" mt="md">
                <Link href="http://jjj.or.kr/" target="_blank" className="text-gray-500 hover:text-black transition-colors text-sm underline">
                  교회 홈페이지
                </Link>
                <Link href="/admin" className="text-gray-500 hover:text-black transition-colors text-sm underline">
                  관리자 페이지
                </Link>
              </Group>

              <Text c="dimmed" size="xs" mt="xl">© 2024 Yedam Community. All rights reserved.</Text>
            </Stack>
          </Center>
        </Container>
      </Box>

      {/* Modals */}

    </Box>
  );
}
