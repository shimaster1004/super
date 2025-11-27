import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuthStore } from "./store/auth";
import supabase from "./utils/supabase";

import {
  ChartNoAxesCombined,
  ChevronDown,
  CodeXml,
  DraftingCompass,
  Footprints,
  Goal,
  Lightbulb,
  List,
  PencilLine,
  Rocket,
  Search,
} from "lucide-react";
import { Button, Input } from "./components/ui";
import { HotTopic, NewTopic } from "./components/topic";
import { toast } from "sonner";
import type { Topic } from "@/types";

const CATEGORIES = [
  { icon: List, label: "전체", value: "" },
  { icon: Lightbulb, label: "인문학", value: "humidity" },
  { icon: Rocket, label: "스타트업", value: "start-up" },
  { icon: CodeXml, label: "IT·프로그래밍", value: "programming" },
  { icon: Goal, label: "서비스·전략 기획", value: "planning" },
  { icon: ChartNoAxesCombined, label: "마케팅", value: "marketing" },
  { icon: DraftingCompass, label: "디자인·일러스트", value: "design" },
  { icon: Footprints, label: "자기계발", value: "self-development" },
];

function App() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  // http://localhost:5173?category=humidity
  const category = searchParams.get("category") || "";

  const [topics, setTopics] = useState<Topic[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  // 1. 전체 항목을 클릭했을 경우, "전체"라는 항목의 value 값을 어떻게 할 것인가?
  // 2. 이미 선택된 항목에 대해 즉, 선택된 항목 재선택시 어떻게 할 것인가?
  // 3. 도메인 즉, URL에 카테고리 value 값을 보여줄 것인지 아닌지?
  // 4. 결국, Supabase Read의 Filtering 기능 사용할 때 어떻게 할 것인가?
  // 5. 검색 기능과의 차별점을 둘 것인가? (선택 사항)
  const handleCategoryChange = (value: string) => {
    // http://localhost:5173/?category=start-up
    if (value === category) return; // => 선택한 항목 재선택한 것이므로 무시
    else if (value === "") setSearchParams({});
    else setSearchParams({ category: value });
  };

  const handleSearch = () => {
    fetchTopics(searchValue);
  };

  const moveToPage = async () => {
    // 1. 로그인 여부 체크
    if (!user) {
      toast.warning("토픽 작성은 로그인 후 이용 가능합니다.");
      return;
    }

    // 토픽 작성하기 버튼 클릭 시, (빈)토픽 생성
    const { data, error } = await supabase
      .from("topics")
      .insert([
        {
          author: user.id,
          title: null,
          category: null,
          thumbnail: null,
          content: null,
          status: "TEMP",
        },
      ])
      .select();

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data) {
      toast.success("토픽을 생성하였습니다.");
      navigate(`/topic/${data[0].id}/create`);
    }
  };

  const fetchTopics = async (searchValue?: string) => {
    try {
      const query = supabase.from("topics").select("*").eq("status", "PUBLISH");

      if (searchValue && searchValue.trim() !== "") {
        query.like("title", `%${searchValue}%`);
      }

      if (category && category.trim() !== "") {
        query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data) {
        setTopics(data);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [category]);

  return (
    <div className="w-full max-w-[1328px] h-full flex items-start py-6 gap-6">
      <aside className="sticky top-18 w-60 min-w-60 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <p className="text-xl font-semibold">카테고리</p>
          <ChevronDown />
        </div>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = item.value === category;

            return (
              <Button
                key={index}
                className={`${
                  isActive && "pl-6! text-white! bg-card!"
                } flex justify-start text-neutral-500 bg-transparent hover:bg-card hover:text-white hover:pl-6 duration-500`}
                onClick={() => handleCategoryChange(item.value)}
              >
                <IconComponent />
                {item.label}
              </Button>
            );
          })}
        </div>
      </aside>
      <div className="min-h-screen flex-1 flex flex-col gap-12">
        <section className="w-full flex flex-col items-center justify-center gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <img src="/gifs/heart.gif" alt="@HEART_GIFS" className="w-8" />
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                지식과 인사이트를 모아,
              </h3>
            </div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              토픽으로 깊이 있게 나누세요!
            </h3>
          </div>
          {/* 검색창 */}
          <div className="w-full max-w-lg flex items-center gap-2 border py-2 pl-4 pr-3 rounded-full">
            <Search size={24} className="text-neutral-500 -mr-2" />
            <Input
              placeholder="관심 있는 클래스, 토픽 주제를 검색하세요."
              onChange={(event) => setSearchValue(event.target.value)}
              className="border-none bg-transparent! focus-visible:ring-0 placeholder:text-base"
            />
            <Button
              variant={"secondary"}
              className="rounded-full"
              onClick={handleSearch}
            >
              검색
            </Button>
          </div>
        </section>
        {/* HOT 토픽 */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <img
                src="/gifs/writing-hand.gif"
                alt="@WRITING-HAND_GIFS"
                className="w-7 mb-2"
              />
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                HOT 토픽
              </h4>
            </div>
            <p className="text-neutral-500 text-base">
              지금 가장 주목받는 주제들을 살펴보고, 다양한 관점의 인사이트를
              얻어보세요.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-6">
            <HotTopic />
            <HotTopic />
            <HotTopic />
            <HotTopic />
          </div>
        </section>
        {/* NEW 토픽 */}
        <section className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <img
                src="/gifs/writing-hand.gif"
                alt="@WRITING-HAND_GIFS"
                className="w-7 mb-2"
              />
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                NEW 토픽
              </h4>
            </div>
            <p className="text-neutral-500 text-base">
              새로운 시선으로, 새로운 이야기를 시작하세요. 지금 바로 당신만의
              토픽을 작성해보세요.
            </p>
          </div>
          {topics.length === 0 ? (
            <div className="w-full flex-1 flex flex-col items-center justify-center gap-2">
              <img src="/vite.svg" alt="" className="w-6 h-6 opacity-50" />
              <p className="text-neutral-500/50">
                조회 가능한 데이터가 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {/* 둘 중 하나의 방법으로 최신순으로 나열한다. */}
              {topics
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )
                .map((topic) => (
                  <NewTopic props={topic} />
                ))}
              {[...topics].reverse().map((topic) => (
                <NewTopic props={topic} />
              ))}
            </div>
          )}
        </section>
      </div>
      <Button
        variant={"destructive"}
        className="fixed bottom-6 left-1/2 -translate-1/2 p-5! rounded-full opacity-75"
        onClick={moveToPage}
      >
        <PencilLine />
        토픽 작성하기
      </Button>
    </div>
  );
}

export default App;
