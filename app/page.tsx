
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { getOrganization, getActiveScripture, getSlideImages, getFacilities, Organization, Scripture, SlideImage, Facility } from '../lib/supabase';
import ImageSlider from '../components/ImageSlider';
import OrganizationChart from '../components/OrganizationChart';

export default function Home() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [scripture, setScripture] = useState<Scripture | null>(null);
  const [slides, setSlides] = useState<SlideImage[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [showWorshipSchedule, setShowWorshipSchedule] = useState(false);
  
  // 스와이프를 위한 ref
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    loadData();
  }, []);

  useEffect(() => {
    if (showWorshipSchedule || selectedFacility) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showWorshipSchedule, selectedFacility]);

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
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 font-sans">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 font-sans" style={{ wordBreak: 'keep-all' }}>
      {/* Header */}
      <header className="text-center px-6 pt-16 pb-12">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 tracking-wide whitespace-nowrap">
            예닮부
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full mb-6"></div>
        </div>
        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
          장전제일교회의 예수님을 닮아가는<br />
          부부 공동체에 오신 걸 환영합니다 ❤️
        </p>
      </header>

      {/* 이미지 슬라이더 */}
      <section className="px-6" ref={sliderRef}>
        <ImageSlider slides={slides} />
      </section>

      {/* 주요 활동 Section */}
      <section className="px-6 py-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center whitespace-nowrap">주요 활동</h2>
        
        {/* 첫 번째 행 - 예배 및 조별모임 */}
        <div className="mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📅</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 text-base mb-1 whitespace-nowrap">예배 및 조별모임</h3>
                <p className="text-sm text-gray-600">주일 2부 예배 후 따뜻한 교제</p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-xs text-gray-500">
                    <i className="ri-map-pin-line mr-2 w-3 h-3 flex items-center justify-center"></i>
                    <span>1층 유년부실</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <i className="ri-time-line mr-2 w-3 h-3 flex items-center justify-center"></i> 
                    <span>주일 오후 2시</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 나머지 활동들 - 2x2 그리드 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-xl">🏠</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1 text-center whitespace-nowrap">가정예배</h3>
            <p className="text-xs text-gray-600 text-center">믿음의 가정 세우기</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-xl">🙏</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1 text-center whitespace-nowrap">기도모임</h3>
            <p className="text-xs text-gray-600 text-center">형제, 자매별 기도 모임</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-xl">🤝</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1 text-center whitespace-nowrap">세겹줄 모임</h3>
            <p className="text-xs text-gray-600 text-center">소그룹별 깊은 교제</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-xl">⛪</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1 text-center whitespace-nowrap">아웃리치</h3>
            <p className="text-xs text-gray-600 text-center">지역교회 섬김</p>
          </div>
        </div>
      </section>

      {/* 예닮부 조직도 Section */}
      <section className="px-6 py-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center whitespace-nowrap">예닮부 조직도</h2>
        <p className="text-gray-600 text-center mb-6 text-sm">
          예닮부를 섬기는 리더들을 소개합니다<br />
          각 팀을 클릭하면 자세한 정보를 볼 수 있어요 😊
        </p>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">로딩 중...</p>
          </div>
        ) : (
          <OrganizationChart organizations={organizations} />
        )}
      </section>

      {/* 교회 시설 안내 Section */}
      <section className="px-6 py-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center whitespace-nowrap">교회 시설 안내</h2>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-center text-sm text-gray-500 mb-4">각 시설을 클릭하면 사진을 볼 수 있습니다</p>
          <div className="space-y-4">
            {facilities.map((facility, index) => {
              const iconMap = {
                '1층 유년부실': 'ri-map-pin-line',
                '3층 모자실': 'ri-parent-line',
                '주차장': 'ri-car-line',
                '식당': 'ri-restaurant-line',
                '쉴만한물가': 'ri-cup-line'
              };
              const colorMap = {
                '1층 유년부실': 'bg-blue-100 text-blue-600 hover:bg-blue-200',
                '3층 모자실': 'bg-green-100 text-green-600 hover:bg-green-200',
                '주차장': 'bg-purple-100 text-purple-600 hover:bg-purple-200',
                '식당': 'bg-orange-100 text-orange-600 hover:bg-orange-200',
                '쉴만한물가': 'bg-pink-100 text-pink-600 hover:bg-pink-200'
              };
              
              return (
                <div 
                  key={facility.id} 
                  className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-3 transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-sm"
                  onClick={() => setSelectedFacility(facility)}
                >
                  <div className={`w-12 h-12 ${colorMap[facility.name as keyof typeof colorMap] || 'bg-gray-100 text-gray-600 hover:bg-gray-200'} rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200`}>
                    <i className={iconMap[facility.name as keyof typeof iconMap] || 'ri-building-line'}></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-800 whitespace-nowrap">{facility.name}</h4>
                      <i className="ri-image-line text-gray-400 text-sm"></i>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{facility.description}</p>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <i className="ri-arrow-right-s-line"></i>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 교회 예배 순서 안내 Section */}
      <section className="px-6 py-8">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center">
                <i className="ri-calendar-line text-indigo-600"></i>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 whitespace-nowrap">교회 전체 예배 순서</h3>
                <p className="text-xs text-gray-500">장전제일교회 예배 시간표</p>
              </div>
            </div>
            <button
              onClick={() => setShowWorshipSchedule(true)}
              className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-200 transition-all duration-200 text-sm whitespace-nowrap flex items-center space-x-1"
            >
              <i className="ri-eye-line"></i>
              <span>보기</span>
            </button>
          </div>
        </div>
      </section>

      {/* 말씀 Section */}
      {scripture && (
        <section className="px-6 py-8">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <p className="text-gray-600 mb-4 leading-relaxed italic">
              {scripture.verse}
            </p>
            <p className="text-sm text-gray-500 mb-4">({scripture.reference})</p>
            <p className="text-gray-700 font-medium">
              {scripture.description}
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-6 py-8 pb-20 text-center text-gray-600">
        <div className="mb-4">
          <h3 className="font-bold text-gray-800 mb-2 whitespace-nowrap">장전제일교회</h3>
          <p className="text-sm mb-1">(46292) 부산광역시 금정구 금정로 50 (장전동)</p>
          <Link 
            href="http://jjj.or.kr/" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            장전제일교회 홈페이지
          </Link>
        </div>
        <p className="text-xs text-gray-500">© 2024 예닮부</p>
        <Link 
          href="/admin" 
          className="inline-block mt-4 text-xs text-gray-400 hover:text-gray-600"
        >
          관리자 페이지
        </Link>
      </footer>

      {/* 시설 상세 모달 */}
      {selectedFacility && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedFacility(null);
          }}
        >
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 whitespace-nowrap">{selectedFacility.name}</h3>
              <button
                onClick={() => setSelectedFacility(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            {selectedFacility.image_url && (
              <img
                src={selectedFacility.image_url}
                alt={selectedFacility.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            
            <p className="text-gray-600 leading-relaxed">{selectedFacility.description}</p>
          </div>
        </div>
      )}

      {/* 교회 예배 순서 모달 */}
      {showWorshipSchedule && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowWorshipSchedule(false);
          }}
        >
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 whitespace-nowrap">장전제일교회 예배 순서</h3>
              <button
                onClick={() => setShowWorshipSchedule(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            
            <div className="w-full">
              <img
                src="https://static.readdy.ai/image/2eec8f2e3fea9f0e53d55920226e61ae/2300adae0c509ef15c542ab27aaa0586.jfif"
                alt="장전제일교회 예배 순서"
                className="w-full h-auto object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
