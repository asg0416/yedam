'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
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
  Card,
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
  Badge,
  ActionIcon
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

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

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    loadData();
  }, []);

  // Update modal state when facility is selected
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
      // Mock data for UI verification
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
        description: "이번 주 암송 구절입니다 화이팅!",
        is_active: true, created_at: "", updated_at: ""
      });
      setSlides([
        { id: 1, title: "환영합니다", image_url: "https://placehold.co/800x400/eebefa/white?text=Welcome", description: "환영이미지", order_index: 1, is_active: true, created_at: "", updated_at: "" }
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

  if (!isClient) {
    return (
      <Center h="100vh" bg="gray.0">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Box bg="gray.0" pb="xl" style={{ wordBreak: 'keep-all' }}>
      {/* Header */}
      <Box component="header" pt={60} pb={40} bg="white">
        <Container size="lg">
          <Center>
            <Stack align="center" gap="md">
              <Box>
                <Title order={1} c="dark.8" style={{ letterSpacing: '2px' }}>
                  예닮부
                </Title>
                <Box h={4} w={64} bg="blue.5" mx="auto" mt="sm" style={{ borderRadius: '999px' }} />
              </Box>
              <Text c="dimmed" size="lg" ta="center" lh={1.6}>
                장전제일교회의 예수님을 닮아가는<br />
                부부 공동체에 오신 걸 환영합니다 ❤️
              </Text>
            </Stack>
          </Center>
        </Container>
      </Box>

      {/* Image Slider */}
      <Container size="lg" my="md" ref={sliderRef}>
        <Box style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <ImageSlider slides={slides} />
        </Box>
      </Container>

      {/* Major Activities */}
      <Container size="lg" py="xl">
        <Title order={2} ta="center" mb="xl">주요 활동</Title>

        {/* Main Activity */}
        <Card shadow="sm" padding="lg" radius="md" mb="md" withBorder>
          <Group wrap="nowrap" align="center">
            <ThemeIcon size={64} radius="xl" variant="light" color="blue">
              <span style={{ fontSize: '24px' }}>📅</span>
            </ThemeIcon>
            <Box style={{ flex: 1 }}>
              <Text fw={500} size="lg" mb={4}>예배 및 조별모임</Text>
              <Text size="sm" c="dimmed" mb="xs">주일 2부 예배 후 따뜻한 교제</Text>
              <Stack gap={4}>
                <Group gap={6}>
                  <i className="ri-map-pin-line" style={{ color: '#909296' }}></i>
                  <Text size="xs" c="dimmed">1층 유년부실</Text>
                </Group>
                <Group gap={6}>
                  <i className="ri-time-line" style={{ color: '#909296' }}></i>
                  <Text size="xs" c="dimmed">주일 오후 2시</Text>
                </Group>
              </Stack>
            </Box>
          </Group>
        </Card>

        {/* Other Activities Grid */}
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
          {[
            { icon: '🏠', title: '가정예배', desc: '믿음의 가정 세우기', color: 'green' },
            { icon: '🙏', title: '기도모임', desc: '형제, 자매별 기도 모임', color: 'grape' },
            { icon: '🤝', title: '세겹줄 모임', desc: '소그룹별 깊은 교제', color: 'orange' },
            { icon: '⛪', title: '아웃리치', desc: '지역교회 섬김', color: 'pink' }
          ].map((item, index) => (
            <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
              <Center mb="sm">
                <ThemeIcon size={48} radius="xl" variant="light" color={item.color}>
                  <span style={{ fontSize: '20px' }}>{item.icon}</span>
                </ThemeIcon>
              </Center>
              <Text fw={500} size="sm" ta="center" mb={4}>{item.title}</Text>
              <Text size="xs" c="dimmed" ta="center">{item.desc}</Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>


      {/* Organization Chart */}
      <Container size="lg" py="xl">
        <Title order={2} ta="center" mb="sm">예닮부 조직도</Title>
        <Text c="dimmed" ta="center" size="sm" mb="xl">
          예닮부를 섬기는 리더들을 소개합니다<br />
          각 팀을 클릭하면 자세한 정보를 볼 수 있어요 😊
        </Text>

        {loading ? (
          <Center py="xl">
            <Loader />
          </Center>
        ) : (
          <OrganizationChart organizations={organizations} />
        )}
      </Container>

      {/* Facilities */}
      <Container size="lg" py="xl">
        <Title order={2} ta="center" mb="xl">교회 시설 안내</Title>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="sm" c="dimmed" ta="center" mb="lg">각 시설을 클릭하면 사진을 볼 수 있습니다</Text>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            {facilities.map((facility, index) => {
              const iconMap: Record<string, string> = {
                '1층 유년부실': 'ri-map-pin-line',
                '3층 모자실': 'ri-parent-line',
                '주차장': 'ri-car-line',
                '식당': 'ri-restaurant-line',
                '쉴만한물가': 'ri-cup-line'
              };
              const colorMap: Record<string, string> = {
                '1층 유년부실': 'blue',
                '3층 모자실': 'green',
                '주차장': 'grape',
                '식당': 'orange',
                '쉴만한물가': 'pink'
              };

              const color = colorMap[facility.name] || 'gray';

              return (
                <Card
                  key={facility.id}
                  padding="sm"
                  radius="md"
                  onClick={() => setSelectedFacility(facility)}
                  className="cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:-translate-y-0.5"
                  withBorder
                >
                  <Group wrap="nowrap">
                    <ThemeIcon size="lg" radius="xl" color={color} variant="light" w={48} h={48}>
                      <i className={iconMap[facility.name] || 'ri-building-line'} style={{ fontSize: '20px' }}></i>
                    </ThemeIcon>
                    <Box style={{ flex: 1 }}>
                      <Group gap="xs">
                        <Text fw={500}>{facility.name}</Text>
                        <i className="ri-image-line" style={{ color: '#ADB5BD', fontSize: '14px' }}></i>
                      </Group>
                      <Text size="sm" c="dimmed" mt={4} lineClamp={1}>{facility.description}</Text>
                    </Box>
                    <i className="ri-arrow-right-s-line" style={{ color: '#ADB5BD' }}></i>
                  </Group>
                </Card>
              );
            })}
          </SimpleGrid>
        </Card>
      </Container>

      {/* Worship Schedule */}
      <Container size="lg" py="xl">
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Group justify="space-between">
            <Group>
              <ThemeIcon size={40} radius="xl" variant="light" color="indigo">
                <i className="ri-calendar-line"></i>
              </ThemeIcon>
              <Box>
                <Text fw={500}>교회 전체 예배 순서</Text>
                <Text size="xs" c="dimmed">장전제일교회 예배 시간표</Text>
              </Box>
            </Group>
            <Button
              variant="light"
              color="indigo"
              size="xs"
              leftSection={<i className="ri-eye-line"></i>}
              onClick={openSchedule}
            >
              보기
            </Button>
          </Group>
        </Card>
      </Container>

      {/* Scripture */}
      {scripture && (
        <Container size="lg" py="xl">
          <Card shadow="sm" padding="xl" radius="md" withBorder style={{ textAlign: 'center' }}>
            <Text size="lg" c="dimmed" fs="italic" mb="md" lh={1.8}>
              {scripture.verse}
            </Text>
            <Text size="sm" c="dimmed" mb="md">({scripture.reference})</Text>
            <Text fw={500} c="dark.6">
              {scripture.description}
            </Text>
          </Card>
        </Container>
      )}

      {/* Footer */}
      <Box component="footer" py={60} ta="center" c="dimmed">
        <Container size="lg">
          <Stack gap="xs">
            <Title order={3} size="h4" c="dark.8">장전제일교회</Title>
            <Text size="sm">(46292) 부산광역시 금정구 금정로 50 (장전동)</Text>
            <Box>
              <Link
                href="http://jjj.or.kr/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '14px', color: '#228be6', textDecoration: 'underline' }}
              >
                장전제일교회 홈페이지
              </Link>
            </Box>
            <Text size="xs" mt="md">© 2024 예닮부</Text>
            <Box mt="xs">
              <Link href="/admin" style={{ fontSize: '12px', color: '#ADB5BD' }}>
                관리자 페이지
              </Link>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Modals */}

      {/* Facility Modal */}
      <Modal
        opened={openedFacility}
        onClose={() => {
          closeFacility();
          setSelectedFacility(null);
        }}
        title={selectedFacility?.name}
        centered
        size="md"
        radius="md"
      >
        {selectedFacility && (
          <Box>
            {selectedFacility.image_url && (
              <Image
                src={selectedFacility.image_url}
                alt={selectedFacility.name}
                radius="md"
                mb="md"
                h={200}
                fit="cover"
              />
            )}
            <Text c="dimmed" lh={1.6}>{selectedFacility.description}</Text>
          </Box>
        )}
      </Modal>

      {/* Worship Schedule Modal */}
      <Modal
        opened={openedSchedule}
        onClose={closeSchedule}
        title="장전제일교회 예배 순서"
        centered
        size="lg"
        radius="md"
      >
        <Image
          src="https://static.readdy.ai/image/2eec8f2e3fea9f0e53d55920226e61ae/2300adae0c509ef15c542ab27aaa0586.jfif"
          alt="장전제일교회 예배 순서"
          radius="md"
        />
      </Modal>
    </Box>
  );
}
