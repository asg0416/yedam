"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Reorder } from "framer-motion";
import {
  getOrganization,
  getActiveScripture,
  getSlideImages,
  getFacilities,
  updateOrganization,
  addOrganization,
  deleteOrganization,
  updateScripture,
  addSlideImage,
  updateSlideImage,
  deleteSlideImage,
  updateFacility,
  addFacility,
  deleteFacility,
  updateAdminPassword,
  updateMultipleOrganizationOrder,
  updateMultipleSlideOrder,
  updateMultipleFacilityOrder,
  Organization,
  Scripture,
  SlideImage,
  Facility,
} from "../../lib/supabase";
import Link from "next/link";

export default function AdminPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [scripture, setScripture] = useState<Scripture | null>(null);
  const [slides, setSlides] = useState<SlideImage[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("slides");
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [editingScripture, setEditingScripture] = useState(false);
  const [editingSlide, setEditingSlide] = useState<SlideImage | null>(null);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPasswordVisibility, setShowNewPasswordVisibility] =
    useState(false);
  const [saving, setSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const isLoggedIn = localStorage.getItem("admin_logged_in");
    if (!isLoggedIn) {
      router.push("/admin/login");
      return;
    }
    loadData();
  }, [router, isClient]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [orgData, scriptureData, slideData, facilityData] =
        await Promise.all([
          getOrganization(),
          getActiveScripture(),
          getSlideImages(),
          getFacilities(),
        ]);
      setOrganizations(orgData);
      setScripture(scriptureData);
      setSlides(slideData);
      setFacilities(facilityData);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_logged_in");
      router.push("/admin/login");
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword.trim()) return;

    setSaving(true);
    const success = await updateAdminPassword(newPassword);
    if (success) {
      setShowPasswordModal(false);
      setNewPassword("");
      alert("비밀번호가 성공적으로 변경되었습니다.");
    } else {
      alert("비밀번호 변경에 실패했습니다.");
    }
    setSaving(false);
  };

  const handleSaveOrganization = async (orgData: Partial<Organization>) => {
    setSaving(true);
    const result = editingOrg?.id
      ? await updateOrganization(editingOrg.id, orgData)
      : await addOrganization({
        ...orgData,
        order_index: organizations.length + 1,
      } as Omit<Organization, "id" | "created_at" | "updated_at">);

    if (result) {
      if (editingOrg?.id) {
        setOrganizations(
          organizations.map((org) => (org.id === editingOrg.id ? result : org))
        );
      } else {
        setOrganizations([...organizations, result]);
      }
    }

    setEditingOrg(null);
    setSaving(false);
  };

  const handleDeleteOrganization = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const success = await deleteOrganization(id);
    if (success) {
      setOrganizations(organizations.filter((org) => org.id !== id));
    }
  };

  const handleSaveScripture = async (scriptureData: Partial<Scripture>) => {
    setSaving(true);
    const result = await updateScripture(scriptureData);
    if (result) {
      setScripture(result);
    }
    setEditingScripture(false);
    setSaving(false);
  };

  const handleSaveSlide = async (slideData: Partial<SlideImage>) => {
    setSaving(true);

    const result = editingSlide?.id
      ? await updateSlideImage(editingSlide.id, slideData)
      : await addSlideImage({
        ...slideData,
        order_index: slides.length + 1,
        is_active: true,
      } as Omit<SlideImage, "id" | "created_at" | "updated_at">);

    if (result) {
      if (editingSlide?.id) {
        setSlides(
          slides.map((slide) => (slide.id === editingSlide.id ? result : slide))
        );
      } else {
        setSlides([...slides, result]);
      }
    }

    setEditingSlide(null);
    setSaving(false);
  };

  const handleDeleteSlide = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const success = await deleteSlideImage(id);
    if (success) {
      setSlides(slides.filter((slide) => slide.id !== id));
    }
  };

  const handleSaveFacility = async (facilityData: Partial<Facility>) => {
    setSaving(true);
    const result = editingFacility?.id
      ? await updateFacility(editingFacility.id, facilityData)
      : await addFacility({
        ...facilityData,
        order_index: facilities.length + 1,
        is_active: true,
      } as Omit<Facility, "id" | "created_at" | "updated_at">);

    if (result) {
      if (editingFacility?.id) {
        setFacilities(
          facilities.map((facility) =>
            facility.id === editingFacility.id ? result : facility
          )
        );
      } else {
        setFacilities([...facilities, result]);
      }
    }

    setEditingFacility(null);
    setSaving(false);
  };

  const handleDeleteFacility = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const success = await deleteFacility(id);
    if (success) {
      setFacilities(facilities.filter((facility) => facility.id !== id));
    }
  };

  const handleUpdateOrganizationOrder = async (
    reorderedOrgs: Organization[]
  ) => {
    // Optimistic Update
    setOrganizations(reorderedOrgs);
    // API Call
    await updateMultipleOrganizationOrder(reorderedOrgs);
  };

  const handleUpdateSlideOrder = async (reorderedSlides: SlideImage[]) => {
    // Optimistic Update
    setSlides(reorderedSlides);
    // API Call
    await updateMultipleSlideOrder(reorderedSlides);
  };

  const handleUpdateFacilityOrder = async (reorderedFacilities: Facility[]) => {
    // Optimistic Update
    setFacilities(reorderedFacilities);
    // API Call
    await updateMultipleFacilityOrder(reorderedFacilities);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50 from-green-50/50 to-white"
      style={{ wordBreak: "keep-all" }}
    >
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap">
                관리자 페이지
              </h1>
              <p className="text-gray-600 text-sm">
                예닮부 정보를 관리할 수 있습니다
              </p>
            </div>
            <div className="flex justify-center sm:justify-end flex-wrap gap-2">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center space-x-1 text-sm whitespace-nowrap"
              >
                <i className="ri-lock-line"></i>
                <span>비밀번호 변경</span>
              </button>
              <Link
                href="/"
                className="bg-teal-50 text-teal-700 px-3 py-2 rounded-lg hover:bg-teal-100 transition-all duration-200 flex items-center space-x-1 text-sm whitespace-nowrap"
              >
                <i className="ri-home-line"></i>
                <span>홈으로</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-all duration-200 flex items-center space-x-1 text-sm whitespace-nowrap"
              >
                <i className="ri-logout-box-line"></i>
                <span>로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 overflow-x-auto">
          {[
            { id: "slides", label: "슬라이드", icon: "ri-image-line" },
            { id: "organization", label: "조직도", icon: "ri-team-line" },
            { id: "facilities", label: "교회 시설", icon: "ri-building-line" },
            { id: "scripture", label: "말씀", icon: "ri-book-open-line" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center justify-center space-x-1 px-3 py-3 rounded-lg transition-all duration-200 text-sm whitespace-nowrap ${activeTab === tab.id
                ? "bg-white text-teal-600 shadow-sm ring-1 ring-gray-100"
                : "text-gray-500 hover:text-gray-800"
                }`}
            >
              <i className={tab.icon}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 슬라이드 관리 */}
        {activeTab === "slides" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 whitespace-nowrap">
                슬라이드 관리
              </h2>
              <button
                onClick={() =>
                  setEditingSlide({
                    id: 0,
                    title: "",
                    image_url: "",
                    description: "",
                    order_index: 0,
                    is_active: true,
                    created_at: "",
                    updated_at: "",
                  })
                }
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center space-x-2 whitespace-nowrap"
              >
                <i className="ri-add-line"></i>
                <span>새 슬라이드 추가</span>
              </button>
            </div>

            <DraggableSlideList
              slides={slides}
              onReorder={handleUpdateSlideOrder}
              onEdit={setEditingSlide}
              onDelete={handleDeleteSlide}
            />
          </div>
        )}

        {/* 조직도 관리 */}
        {activeTab === "organization" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 whitespace-nowrap">
                조직도 관리
              </h2>
              <button
                onClick={() =>
                  setEditingOrg({
                    id: 0,
                    name: "",
                    description: "",
                    members: [],
                    order_index: 0,
                    created_at: "",
                    updated_at: "",
                  })
                }
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center space-x-2 whitespace-nowrap"
              >
                <i className="ri-add-line"></i>
                <span>새 조직 추가</span>
              </button>
            </div>

            <DraggableOrganizationList
              organizations={organizations}
              onReorder={handleUpdateOrganizationOrder}
              onEdit={setEditingOrg}
              onDelete={handleDeleteOrganization}
            />
          </div>
        )}

        {/* 교회 시설 관리 */}
        {activeTab === "facilities" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 whitespace-nowrap">
                교회 시설 관리
              </h2>
              <button
                onClick={() =>
                  setEditingFacility({
                    id: 0,
                    name: "",
                    description: "",
                    image_url: "",
                    order_index: 0,
                    is_active: true,
                    created_at: "",
                    updated_at: "",
                  })
                }
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center space-x-2 whitespace-nowrap"
              >
                <i className="ri-add-line"></i>
                <span>새 시설 추가</span>
              </button>
            </div>

            <DraggableFacilityList
              facilities={facilities}
              onReorder={handleUpdateFacilityOrder}
              onEdit={setEditingFacility}
              onDelete={handleDeleteFacility}
            />
          </div>
        )}

        {/* 말씀 관리 */}
        {activeTab === "scripture" && scripture && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 whitespace-nowrap">
                말씀 관리
              </h2>
              <button
                onClick={() => setEditingScripture(true)}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all duration-200 flex items-center space-x-2 whitespace-nowrap"
              >
                <i className="ri-edit-line"></i>
                <span>말씀 수정</span>
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="text-center">
                <p className="text-gray-600 mb-4 leading-relaxed italic text-lg">
                  {scripture.verse}
                </p>
                <p className="text-gray-500 mb-4">({scripture.reference})</p>
                <p className="text-gray-700 font-medium">
                  {scripture.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 조직 편집 모달 */}
      {editingOrg && (
        <OrganizationModal
          organization={editingOrg}
          onSave={handleSaveOrganization}
          onClose={() => setEditingOrg(null)}
          saving={saving}
        />
      )}

      {/* 말씀 편집 모달 */}
      {editingScripture && scripture && (
        <ScriptureModal
          scripture={scripture}
          onSave={handleSaveScripture}
          onClose={() => setEditingScripture(false)}
          saving={saving}
        />
      )}

      {/* 슬라이드 편집 모달 */}
      {editingSlide && (
        <SlideModal
          slide={editingSlide}
          onSave={handleSaveSlide}
          onClose={() => setEditingSlide(null)}
          saving={saving}
        />
      )}

      {/* 시설 편집 모달 */}
      {editingFacility && (
        <FacilityModal
          facility={editingFacility}
          onSave={handleSaveFacility}
          onClose={() => setEditingFacility(null)}
          saving={saving}
        />
      )}

      {/* 비밀번호 변경 모달 */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPasswordModal(false);
              setNewPassword("");
            }
          }}
        >
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4 whitespace-nowrap">
              비밀번호 변경
            </h3>
            <div className="relative">
              <input
                type={showNewPasswordVisibility ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호를 입력하세요"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-4"
              />
              <button
                type="button"
                onClick={() =>
                  setShowNewPasswordVisibility(!showNewPasswordVisibility)
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 -mt-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <i
                  className={
                    showNewPasswordVisibility
                      ? "ri-eye-off-line text-lg"
                      : "ri-eye-line text-lg"
                  }
                ></i>
              </button>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleUpdatePassword}
                disabled={saving || !newPassword.trim()}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all duration-200 disabled:opacity-50 whitespace-nowrap"
              >
                {saving ? "저장 중..." : "저장"}
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword("");
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-200 whitespace-nowrap"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 조직 편집 모달 컴포넌트
function OrganizationModal({
  organization,
  onSave,
  onClose,
  saving,
}: {
  organization: Organization;
  onSave: (data: Partial<Organization>) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState({
    name: organization.name,
    description: organization.description,
    members: organization.members || [],
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleAddMember = () => {
    setFormData({
      ...formData,
      members: [...formData.members, { name: "", role: "", image_url: "" }],
    });
  };

  const handleRemoveMember = (index: number) => {
    setFormData({
      ...formData,
      members: formData.members.filter((_, i) => i !== index),
    });
  };

  const handleMemberChange = (index: number, field: string, value: string) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData({ ...formData, members: updatedMembers });
  };

  const handleImageUpload = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        handleMemberChange(index, "image_url", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-gray-800 mb-4 whitespace-nowrap">
          {organization.id ? "조직 수정" : "조직 추가"}
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="조직명"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />

            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="조직 설명"
              rows={2}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-800 whitespace-nowrap">
                구성원
              </h4>
              <button
                onClick={handleAddMember}
                className="bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-all duration-200 text-sm whitespace-nowrap"
              >
                + 구성원 추가
              </button>
            </div>

            <div className="space-y-4 max-h-60 overflow-y-auto">
              {formData.members?.map((member, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-4 border border-gray-200 rounded-lg p-4"
                >
                  <div className="lg:col-span-3">
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) =>
                        handleMemberChange(index, "role", e.target.value)
                      }
                      placeholder="역할"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div className="lg:col-span-3">
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) =>
                        handleMemberChange(index, "name", e.target.value)
                      }
                      placeholder="이름"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div className="lg:col-span-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div className="lg:col-span-1 flex items-center justify-center">
                    {member.image_url && (
                      <div className=" w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div className="lg:col-span-1 flex items-center justify-center">
                    <button
                      onClick={() => handleRemoveMember(index)}
                      className="bg-red-100 text-red-700 px-2 py-1 rounded-lg hover:bg-red-200 transition-all duration-200"
                    >
                      <i className="ri-delete-bin-line text-sm"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => onSave(formData)}
            disabled={saving || !formData.name.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 whitespace-nowrap"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-200 whitespace-nowrap"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

// 말씀 편집 모달 컴포넌트
function ScriptureModal({
  scripture,
  onSave,
  onClose,
  saving,
}: {
  scripture: Scripture;
  onSave: (data: Partial<Scripture>) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState({
    verse: scripture.verse,
    reference: scripture.reference,
    description: scripture.description,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-gray-800 mb-4 whitespace-nowrap">
          말씀 수정
        </h3>

        <div className="space-y-4">
          <textarea
            value={formData.verse}
            onChange={(e) =>
              setFormData({ ...formData, verse: e.target.value })
            }
            placeholder="성경 구절"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
          />

          <input
            type="text"
            value={formData.reference}
            onChange={(e) =>
              setFormData({ ...formData, reference: e.target.value })
            }
            placeholder="성경 출처 (예: 빌립보서 1:6)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />

          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="설명"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => onSave(formData)}
            disabled={saving || !formData.verse.trim()}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all duration-200 disabled:opacity-50 whitespace-nowrap"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-200 whitespace-nowrap"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

// 슬라이드 편집 모달 컴포넌트
function SlideModal({
  slide,
  onSave,
  onClose,
  saving,
}: {
  slide: SlideImage;
  onSave: (data: Partial<SlideImage>) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState({
    title: slide.title,
    image_url: slide.image_url,
    description: slide.description,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setFormData({ ...formData, image_url: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-gray-800 mb-4 whitespace-nowrap">
          {slide.id ? "슬라이드 수정" : "슬라이드 추가"}
        </h3>

        <div className="space-y-4">
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="슬라이드 제목"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 whitespace-nowrap">
              이미지 업로드
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="슬라이드 설명"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />

          {formData.image_url && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2 whitespace-nowrap">
                미리보기:
              </p>
              <img
                src={formData.image_url}
                alt="미리보기"
                className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
              />
            </div>
          )}
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => onSave(formData)}
            disabled={
              saving || !formData.title.trim() || !formData.image_url.trim()
            }
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all duration-200 disabled:opacity-50 whitespace-nowrap"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-200 whitespace-nowrap"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

// 시설 편집 모달 컴포넌트
function FacilityModal({
  facility,
  onSave,
  onClose,
  saving,
}: {
  facility: Facility;
  onSave: (data: Partial<Facility>) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState({
    name: facility.name,
    description: facility.description,
    image_url: facility.image_url || "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setFormData({ ...formData, image_url: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-gray-800 mb-4 whitespace-nowrap">
          {facility.id ? "시설 수정" : "시설 추가"}
        </h3>

        <div className="space-y-4">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="시설명"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />

          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="시설 설명"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 whitespace-nowrap">
              시설 사진 업로드
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {formData.image_url && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2 whitespace-nowrap">
                미리보기:
              </p>
              <img
                src={formData.image_url}
                alt="미리보기"
                className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
              />
            </div>
          )}
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => onSave(formData)}
            disabled={saving || !formData.name.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 whitespace-nowrap"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-200 whitespace-nowrap"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

// 드래그 가능한 슬라이드 목록 컴포넌트
// 드래그 가능한 슬라이드 목록 컴포넌트
function DraggableSlideList({
  slides,
  onReorder,
  onEdit,
  onDelete,
}: {
  slides: SlideImage[];
  onReorder: (reorderedSlides: SlideImage[]) => void;
  onEdit: (slide: SlideImage) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
        <i className="ri-information-line mr-2"></i>
        항목을 드래그해서 순서를 변경할 수 있습니다
      </p>

      <Reorder.Group axis="y" values={slides} onReorder={onReorder} className="space-y-4">
        {slides.map((slide) => (
          <Reorder.Item
            key={slide.id}
            value={slide}
            className="bg-white rounded-xl p-6 shadow-sm border cursor-move hover:shadow-lg transition-shadow duration-200 relative select-none"
            whileDrag={{ scale: 1.02, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
          >
            {/* Visual content */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="hidden sm:flex items-center justify-center w-8 self-center text-gray-300">
                <i className="ri-drag-move-2-line text-xl"></i>
              </div>

              <img
                src={slide.image_url}
                alt={slide.title}
                className="w-full sm:w-32 h-40 sm:h-24 object-cover rounded-lg flex-shrink-0 bg-gray-100"
              />
              <div className="flex-1 min-w-0 py-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                  {slide.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                  {slide.description}
                </p>
              </div>
              <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 justify-center">
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => onEdit(slide)}
                  className="bg-teal-50 text-teal-700 px-3 py-2 rounded-lg hover:bg-teal-100 transition-all duration-200 whitespace-nowrap"
                >
                  <i className="ri-edit-line"></i>
                </button>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => onDelete(slide.id)}
                  className="bg-red-50 text-red-700 px-3 py-2 rounded-lg hover:bg-red-100 transition-all duration-200 whitespace-nowrap"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}

// 드래그 가능한 조직 목록 컴포넌트
// 드래그 가능한 조직 목록 컴포넌트
function DraggableOrganizationList({
  organizations,
  onReorder,
  onEdit,
  onDelete,
}: {
  organizations: Organization[];
  onReorder: (reorderedOrgs: Organization[]) => void;
  onEdit: (org: Organization) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
        <i className="ri-information-line mr-2"></i>
        항목을 드래그해서 순서를 변경할 수 있습니다
      </p>

      <Reorder.Group axis="y" values={organizations} onReorder={onReorder} className="space-y-4">
        {organizations.map((org) => (
          <Reorder.Item
            key={org.id}
            value={org}
            className="bg-white rounded-xl p-6 shadow-sm border cursor-move hover:shadow-lg transition-shadow duration-200 relative select-none"
            whileDrag={{ scale: 1.02, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
          >
            <div className="flex justify-between items-start">
              <div className="flex space-x-4 items-start flex-1">
                <div className="hidden sm:flex items-center justify-center w-8 pt-1 text-gray-300">
                  <i className="ri-drag-move-2-line text-xl"></i>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {org.name}
                  </h3>
                  <p className="text-gray-600 mb-3">{org.description}</p>
                  {org.members && org.members.length > 0 && (
                    <div className="flex -space-x-2 overflow-hidden mb-2">
                      {org.members.slice(0, 5).map((member, i) => (
                        <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center overflow-hidden">
                          {member.image_url ? <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" /> : <span className="text-xs text-gray-500">{member.name[0]}</span>}
                        </div>
                      ))}
                      {org.members.length > 5 && (
                        <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                          +{org.members.length - 5}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="text-sm text-gray-400">
                    총 {org.members?.length || 0}명
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => onEdit(org)}
                  className="bg-teal-50 text-teal-700 px-3 py-2 rounded-lg hover:bg-teal-100 transition-all duration-200"
                >
                  <i className="ri-edit-line"></i>
                </button>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => onDelete(org.id)}
                  className="bg-red-50 text-red-700 px-3 py-2 rounded-lg hover:bg-red-100 transition-all duration-200"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}

// 드래그 가능한 시설 목록 컴포넌트
// 드래그 가능한 시설 목록 컴포넌트
function DraggableFacilityList({
  facilities,
  onReorder,
  onEdit,
  onDelete,
}: {
  facilities: Facility[];
  onReorder: (reorderedFacilities: Facility[]) => void;
  onEdit: (facility: Facility) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
        <i className="ri-information-line mr-2"></i>
        항목을 드래그해서 순서를 변경할 수 있습니다
      </p>

      <Reorder.Group axis="y" values={facilities} onReorder={onReorder} className="space-y-4">
        {facilities.map((facility) => (
          <Reorder.Item
            key={facility.id}
            value={facility}
            className="bg-white rounded-xl p-6 shadow-sm border cursor-move hover:shadow-lg transition-shadow duration-200 relative select-none"
            whileDrag={{ scale: 1.02, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
          >
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="hidden sm:flex items-center justify-center w-8 self-center text-gray-300">
                <i className="ri-drag-move-2-line text-xl"></i>
              </div>

              {facility.image_url && (
                <img
                  src={facility.image_url}
                  alt={facility.name}
                  className="w-full sm:w-32 h-40 sm:h-24 object-cover rounded-lg flex-shrink-0 bg-gray-100"
                />
              )}
              <div className="flex-1 min-w-0 py-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                  {facility.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                  {facility.description}
                </p>
              </div>
              <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 justify-center">
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => onEdit(facility)}
                  className="bg-teal-50 text-teal-700 px-3 py-2 rounded-lg hover:bg-teal-100 transition-all duration-200 whitespace-nowrap"
                >
                  <i className="ri-edit-line"></i>
                </button>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => onDelete(facility.id)}
                  className="bg-red-50 text-red-700 px-3 py-2 rounded-lg hover:bg-red-100 transition-all duration-200 whitespace-nowrap"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
