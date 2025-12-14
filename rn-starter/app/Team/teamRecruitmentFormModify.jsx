import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import Button from "../../components/Button";
import DateRangePicker from "../../components/DateRangePicker";
import { API_ENDPOINTS } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function teamRecruitmentForm() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // teamId 가져오기
  const teamId = params.teamId ? (Array.isArray(params.teamId) ? params.teamId[0] : params.teamId) : null;

  const getTodayStart = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const getTomorrowStart = () => {
    const date = getTodayStart();
    date.setDate(date.getDate() + 1);
    return date;
  };

  // State 초기화
  const [loading, setLoading] = useState(true);
  const [titleInfo, setTitleInfo] = useState("");
  const [traitInfo, setTraitInfo] = useState("");
  const [introductionInfo, setIntroductionInfo] = useState("");
  const [activityTitle, setActivityTitle] = useState(params.activityTitle || "");
  const [inputs, setInputs] = useState([{ id: Date.now(), value: "" }]);
  const [recruitCount, setRecruitCount] = useState(1);
  const [userInfo, setUserInfo] = useState(null);

  // 모집 날짜 관련 state
  const [startDate, setStartDate] = useState(getTodayStart());
  const [endDate, setEndDate] = useState(getTomorrowStart());

  // 팀 데이터 불러오기
  useEffect(() => {
    const fetchTeamData = async () => {
      if (!teamId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("accessToken");

        if (!token) {
          setLoading(false);
          return;
        }

        // 사용자 정보 가져오기
        const userUrl = API_ENDPOINTS.USER_ME;
        const userResponse = await fetch(userUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const userText = await userResponse.text();
          if (userText && userText.trim().length > 0) {
            try {
              const userData = JSON.parse(userText);
              if (userData.success && userData.data) {
                setUserInfo(userData.data);
              } else {
                setUserInfo(userData);
              }
            } catch (e) {
              console.error("사용자 정보 JSON 파싱 실패:", e);
            }
          }
        }

        const teamIdNum = Number(teamId);
        if (Number.isNaN(teamIdNum)) {
          setLoading(false);
          return;
        }

        const teamUrl = API_ENDPOINTS.GET_TEAM_DETAIL(teamIdNum);
        const response = await fetch(teamUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("팀 정보 불러오기 실패:", response.status);
          setLoading(false);
          return;
        }

        const data = await response.json();
        const teamData = data.success && data.data ? data.data : data;

        // 폼 필드 채우기
        setTitleInfo(teamData.title || "");
        setTraitInfo(teamData.characteristic || "");
        setIntroductionInfo(teamData.promotionText || "");
        setActivityTitle(teamData.connectedActivityTitle || "자율 모집");
        setRecruitCount(teamData.capacity || 1);

        // 역할 데이터 채우기
        if (teamData.requiredRoles && teamData.requiredRoles.length > 0) {
          const roleInputs = teamData.requiredRoles.map((role, index) => ({
            id: Date.now() + index,
            value: role,
          }));
          setInputs(roleInputs);
        } else if (teamData.role && teamData.role.length > 0) {
          const roleInputs = teamData.role.map((role, index) => ({
            id: Date.now() + index,
            value: role,
          }));
          setInputs(roleInputs);
        }

        // 날짜 데이터 채우기
        if (teamData.recruitmentStartDate) {
          const start = new Date(teamData.recruitmentStartDate);
          start.setHours(0, 0, 0, 0);
          setStartDate(start);
        }

        if (teamData.recruitmentEndDate) {
          const end = new Date(teamData.recruitmentEndDate);
          end.setHours(0, 0, 0, 0);
          setEndDate(end);
        }

        setLoading(false);
      } catch (error) {
        console.error("팀 데이터 불러오기 오류:", error);
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId]);

  // 역할 입력 핸들러
  const handleChange = (text, id) => {
    const newInputs = inputs.map((item) => {
      if (item.id === id) {
        return { ...item, value: text };
      }
      return item;
    });
    setInputs(newInputs);
  };

  const addInput = () => {
    const newId = Date.now();
    const newInput = { id: newId, value: "" };
    setInputs((prevInputs) => {
      return [...prevInputs, newInput];
    });
  };

  const removeInput = (id) => {
    if (inputs.length === 1) return;
    const newInputs = inputs.filter((item) => item.id !== id);
    setInputs(newInputs);
  };

  // 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 모집글 삭제 함수
  const deleteTeam = async () => {
    if (!teamId) {
      return;
    }

    try {
      const token = await AsyncStorage.getItem("accessToken");

      if (!token) {
        return;
      }

      const teamIdNum = Number(teamId);
      if (Number.isNaN(teamIdNum)) {
        return;
      }

      const deleteUrl = API_ENDPOINTS.DELETE_TEAM(teamIdNum);
      console.log("삭제 요청 URL:", deleteUrl);

      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      console.log("응답 상태:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("에러 응답 내용:", errorText);
        return;
      }

      // 삭제 성공 시 바로 팀 목록으로 이동
      router.replace("/Team/team");
    } catch (error) {
      console.error("모집글 삭제 오류:", error);
    }
  };

  // 모집글 수정 함수
  const saveRecruitment = async () => {
    if (!teamId) {
      return;
    }

    const roles = inputs
      .map((input) => input.value.trim())
      .filter((value) => value !== "");

    // 필수 입력값 검증
    if (!titleInfo.trim()) {
      return;
    }
    if (roles.length === 0) {
      return;
    }

    // 백엔드 API 형식에 맞게 데이터 구성
    const updatedRecruitment = {
      eventId: 0, // activityTitle에서 eventId를 추출해야 한다면 수정 필요
      title: titleInfo,
      promotionText: introductionInfo || "",
      role: roles,
      characteristic: traitInfo || "",
      capacity: recruitCount,
      recruitmentStartDate: formatDateForAPI(startDate),
      recruitmentEndDate: formatDateForAPI(endDate),
      leaderName: userInfo?.name || "",
      leaderCollege: userInfo?.college || "",
      leaderMajor: userInfo?.major || "",
      leaderGrade: userInfo?.grade || "",
    };

    try {
      const token = await AsyncStorage.getItem("accessToken");

      if (!token) {
        return;
      }

      const teamIdNum = Number(teamId);
      if (Number.isNaN(teamIdNum)) {
        return;
      }

      const updateUrl = API_ENDPOINTS.UPDATE_TEAM(teamIdNum);
      console.log("수정할 데이터:", updatedRecruitment);
      console.log("요청 URL:", updateUrl);

      const response = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedRecruitment),
      });

      console.log("응답 상태:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("에러 응답 내용:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const result = await response.json();
      console.log("서버 응답:", result);

      // 수정 성공 시 바로 확인 페이지로 이동
      router.replace("/Team/teamModifyConfirmed");
    } catch (error) {
      console.error("모집글 수정 오류:", error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ffffff" }}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 8,
          zIndex: 999,
        }}
      >
        <TouchableOpacity style={{ padding: 8 }} onPress={() => router.back()}>
          <Image
            source={require("@/assets/images/left.svg")}
            style={{ width: 30, height: 30 }}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior="height"
        style={{ flex: 1, marginTop: 110 }}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <Text style={styles.mainTitle}>팀 모집글 수정하기</Text>
          <Text style={styles.caption}>
            공모전·교내·대외 활동별로 함께할 팀원을 모집해보세요.
          </Text>

          {/* 고정 정보 섹션 */}
          <Text style={styles.sectionTitle}>연결된 활동 / 공모전</Text>
          <Text style={styles.connectBox}>{activityTitle}</Text>

          <Text style={styles.sectionTitle}>제목</Text>
          <TextInput
            style={styles.defaultInput}
            value={titleInfo}
            onChangeText={setTitleInfo}
            placeholder="제목을 입력해주세요"
          />

          <Text style={styles.sectionTitle}>팀장 이름</Text>
          <Text style={styles.readOnlyText}>{userInfo?.name || ""}</Text>
          <Text style={styles.sectionTitle}>학과</Text>
          <View style={styles.departmentRow}>
            <View style={styles.collegeBox}>
              <Text style={styles.collegeText}>{userInfo?.college || ""}</Text>
            </View>
            <View style={styles.majorBox}>
              <Text style={styles.majorText}>{userInfo?.major || ""}</Text>
            </View>
          </View>
          <Text style={styles.sectionTitle}>학년</Text>
          <Text style={styles.readOnlyText}>{userInfo?.grade ? `${userInfo.grade}학년` : ""}</Text>
          <Text style={styles.sectionTitle}>모집 인원</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setRecruitCount(Math.max(1, recruitCount - 1))}
            >
              <Image
                source={require("@/assets/images/minus.svg")}
                style={styles.counterIcon}
                contentFit="contain"
              />
            </TouchableOpacity>
            <Text style={styles.counterText}>{recruitCount}명</Text>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setRecruitCount(recruitCount + 1)}
            >
              <Image
                source={require("@/assets/images/add.svg")}
                style={styles.counterIcon}
                contentFit="contain"
              />
            </TouchableOpacity>
          </View>

          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            minStartDate={getTodayStart()}
            labelStyle={styles.sectionTitle}
          />

          {/* 역할 입력 섹션 */}
          <Text style={styles.sectionTitle}>역할</Text>

          {inputs.map((item, index) => {
            const isLastItem = index === inputs.length - 1;
            return (
              <View key={item.id} style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder={`모집 역할 #${index + 1} (예: 기획자)`}
                  value={item.value}
                  onChangeText={(text) => handleChange(text, item.id)}
                />
                <TouchableOpacity
                  onPress={() =>
                    isLastItem ? addInput() : removeInput(item.id)
                  }
                  style={[
                    styles.circleButton,
                    isLastItem ? styles.addButton : styles.removeButton,
                  ]}
                >
                  <Image
                    source={
                      isLastItem
                        ? require("@/assets/images/add.svg")
                        : require("@/assets/images/minus.svg")
                    }
                    style={styles.buttonIcon}
                    contentFit="contain"
                  />
                </TouchableOpacity>
              </View>
            );
          })}

          <Text style={styles.sectionTitle}>특성</Text>
          <TextInput
            style={styles.defaultInput}
            value={traitInfo}
            onChangeText={setTraitInfo}
            placeholder="팀이 선호하는 인재상에 대해 작성해주세요."
          />

          <Text style={styles.sectionTitle}>진행 방식 및 한 줄 소개</Text>
          <TextInput
            style={styles.multilineInput}
            value={introductionInfo}
            onChangeText={setIntroductionInfo}
            placeholder="모집글에 대한 소개를 상세하게 작성해주세요."
            multiline={true}
          />
          <View style={{ height: 20 }} />
          <Button title="변경하기" onPress={saveRecruitment} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  mainTitle: {
    width: 345,
    lineHeight: 24,
    fontSize: 22,
    fontFamily: "Pretendard-SemiBold",
    marginTop: 20,
    marginBottom: 12,
    color: "#000",
  },
  caption: {
    width: 304,
    height: 17,
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    lineHeight: 17,
    textAlign: "left",
    color: "#666",
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Pretendard-Medium",
    marginBottom: 16,
    color: "#000",
  },
  connectBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3E6AF433',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    textAlign: 'center',
    marginBottom: 28,
    fontFamily: 'Pretendard-SemiBold',
    color: '#A6A6A6',
  },
  // readOnlyText 스타일 수정 (fontColor 제거, color로 통일)
  readOnlyText: {
    fontSize: 16,
    fontFamily: "Pretendard-Regular",
    color: "#1A1A1A",
    borderBottomColor: "#CCCCCC",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    marginBottom: 28,
    flex: 1,
  },
  departmentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 28,
  },
  collegeBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#3E6AF433",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  collegeText: {
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    color: "#A6A6A6",
  },
  majorBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3E6AF433",
    justifyContent: "center",
    alignItems: "center",
  },
  majorText: {
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    color: "#A6A6A6",
  },
  defaultInput: {
    height: 48,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    fontSize: 16,
    marginBottom: 28,
  },
  multilineInput: {
    height: 100,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    textAlignVertical: "top",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    padding: 10,
    fontSize: 16,
  },
  circleButton: {
    marginLeft: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#FFFFFF",
  },
  removeButton: {
    backgroundColor: "#FFFFFF",
  },
  buttonIcon: {
    width: 24,
    height: 24,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
    paddingHorizontal: 24,
    gap: 20,
  },
  counterButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  counterIcon: {
    width: 24,
    height: 24,
  },
  counterText: {
    fontSize: 18,
    fontFamily: "Pretendard-Medium",
    color: "#000",
    minWidth: 50,
    textAlign: "center",
  },
});
