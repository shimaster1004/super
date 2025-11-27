import { useNavigate } from "react-router";
import { UserInfo } from "./user-info";
import { Card, Separator } from "../ui";
import { CaseSensitive, ChartNoAxesColumnIncreasing, Heart, MessageCircleMore } from "lucide-react";
import type { Topic } from "@/types";

interface Props {
    props: Topic;
}

// 메인 페이지의 NEW 토픽 카드 UI에서 해당 토픽의 내용을 일부분 미리보기로
// 유저가 볼 수 있게 하기 위해 Blocknote가 가진 Block[] 타입에서
// text 요소만 추출하여 UI 구조에 맞게 설정
function extractTextfromContent(content: string, maxChars = 200) {
    const parsed = typeof content === "string" ? JSON.parse(content) : content;

    if (!Array.isArray(parsed)) {
        console.warn("전달받은 Blocknote의 content 데이터 타입이 배열이 아닙니다.");
        return "";
    }

    let result = "";

    for (const block of parsed) {
        if (Array.isArray(block.content)) {
            for (const child of block.content) {
                if (child.text) {
                    result += child.text + " "; // " " 이 코드의 의미는 띄워쓰기 => child.text가 띄워쓰기 없이 쭉 붙어서 출력됨을 방지

                    if (result.length >= maxChars) {
                        return result.slice(0, maxChars);
                    }
                }
            }
        }
    }

    return result.trim();
}

function NewTopic({ props }: Props) {
    const navigate = useNavigate();

    return (
        <Card className="p-4 gap-4" onClick={() => navigate(`/topic/${props.id}`)}>
            <div className="h-fit flex items-center gap-4">
                <div className="h-full flex flex-col justify-between">
                    {/* 제목 */}
                    <div className="flex flex-col">
                        <CaseSensitive size={16} className="text-neutral-500" />
                        <p className="font-semibold text-base line-clamp-2">{props.title}</p>
                    </div>
                    {/* 본문 */}
                    <p className="text-neutral-500 line-clamp-3">
                        {/* NEW Topic 본문 조회 테스트 문구입니다. NEW Topic 본문 조회 테스트 문구입니다. NEW Topic 본문 조회 테스트 문구입니다. NEW Topic 본문 조회 테스트 문구입니다. NEW Topic 본문 조회 테스트 문구입니다. NEW Topic 본문 조회 테스트
                        문구입니다. NEW Topic 본문 조회 테스트 문구입니다. */}
                        {extractTextfromContent(props.content)}
                    </p>
                </div>
                <div className="w-35 min-w-35 bg-accent rounded-md">
                    {/* <img src="/vite.svg" alt="@SAMPLE_IMAGE" className="w-35 min-w-35 bg-accent rounded-md" /> */}
                    <img src={props.thumbnail} alt="@SAMPLE_IMAGE" className="w-full min-h-35 bg-accent rounded-md object-cover" />
                </div>
            </div>
            <Separator />
            <div className="flex items-end justify-between">
                <UserInfo />
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <ChartNoAxesColumnIncreasing size={14} />
                            <p>24</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageCircleMore size={14} />
                            <p>0</p>
                        </div>
                    </div>
                    <Separator orientation="vertical" className="h-3!" />
                    <div className="flex items-center gap-1">
                        <Heart size={14} className="text-rose-500" />
                        <p>1</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export { NewTopic };
