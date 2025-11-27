// 우리가 필요한 정보
// - title: 제목
// - created_at: 작성일
// - content: 내용
// - thumbnail: 썸네일
// - category: 카테고리

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import supabase from "@/utils/supabase";
import dayjs from "dayjs";

import { AppTextEditor } from "@/components/common";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button, Separator } from "@/components/ui";
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";

import type { Topic } from "@/types";

// http://localhost:5173/topic/topic_id
function DetailTopic() {
    const { topic_id } = useParams();
    const navigate = useNavigate();

    const user = useAuthStore((state) => state.user); // 현재 로그인한 유저
    const [topic, setTopic] = useState<Topic>();

    const fetchTopic = async () => {
        try {
            const { data, error } = await supabase
                .from("topics")
                .select("*")
                // Filters
                .eq("id", topic_id);

            if (error) {
                toast.error(error.message);
                return;
            }

            console.log("data: ", data);

            if (data) {
                setTopic(data[0]);
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    // 토픽 삭제
    // 토픽을 작성한 사람의 user_id와 (현재, 우리 Supabase Topics 데이터 테이블에서는 author 컬럼으로 관리 중)
    // 로그인한 유저의 user_id가 일치할 경우에만, 본인이 작성한 글을 삭제하겠다는 것을 의미
    const handleDelete = async () => {
        // 방어 코드
        if (user?.id !== topic?.author) {
            return;
        }

        try {
            const { error } = await supabase.from("topics").delete().eq("id", topic_id);

            if (error) {
                toast.error(error.message);
                return;
            }
            toast.success("토픽 삭제를 완료하였습니다.");
            navigate("/"); // 메인 페이지 리디렉션
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    useEffect(() => {
        fetchTopic();
    }, []);

    return (
        <div className="w-full max-w-[1328px] min-h-[720px] flex-1 flex flex-col justify-center pb-6">
            {/* 제목, 카테고리, 썸네일, 버튼박스 영역 */}
            <div className="relative w-full h-100 bg-cover bg-position-[50%_50%]" style={{ backgroundImage: `url(${topic?.thumbnail})` }}>
                <div className="relative z-20 flex flex-col gap-6">
                    <div className="flex items-center gap-2 mt-6">
                        {/* 뒤로 가기 */}
                        <Button variant={"outline"} size={"icon"}>
                            <ArrowLeft />
                        </Button>

                        {/* 삭제 */}
                        {user?.id === topic?.author && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant={"outline"} size={"icon"} className="bg-red-900/50!">
                                        <Trash2 />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>정말 해당 토픽을 삭제하시겠습니까?</AlertDialogTitle>
                                        <AlertDialogDescription>삭제하시면 해당 토픽의 모든 내용이 영구적으로 삭제되어 복구할 수 없습니다.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>닫기</AlertDialogCancel>
                                        <AlertDialogAction className="bg-red-900/50 text-white border hover:bg-red-800/50" onClick={handleDelete}>
                                            삭제
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                    <div className="flex flex-col items-center gap-6 mt-28">
                        {/* 카테고리 */}
                        <span># {topic?.category}</span>
                        {/* 제목 */}
                        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">{topic?.title}</h1>
                        <Separator className="w-6! bg-white" />
                        {/* 작성일 */}
                        <span>{dayjs(topic?.created_at).format("YYYY. MM. DD")}</span>
                    </div>
                </div>

                {/* 좌, 우, 하단 그라데이션 */}
                <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-linear-to-l from-[#0a0a0a] via-transparent to-transparent"></div>
            </div>
            {/* 콘텐츠 영역 */}
            <div>{topic && <AppTextEditor props={JSON.parse(topic.content)} readonly={true} />}</div>
        </div>
    );
}

export default DetailTopic;
