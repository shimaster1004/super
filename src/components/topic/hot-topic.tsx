import { UserInfo } from "./user-info";
import { Card } from "../ui";

function HotTopic() {
    return (
        <Card className="p-0 gap-4 border-0 bg-transparent">
            <div className="relative">
                <img src="/images/bg-sample.png" alt="@BG-SAMOPLE" className="h-70 rounded-lg" />
                <p className="absolute bottom-4 z-10 px-4 font-semibold text-xl line-clamp-2">
                    NEW Topic 제목 조회 테스트 문구입니다. NEW Topic 제목 조회 테스트 문구입니다. NEW Topic 제목 조회 테스트 문구입니다. NEW Topic 제목 조회 테스트 문구입니다. NEW Topic 제목 조회 테스트 문구입니다.
                </p>
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent rounded-b-lg"></div>
            </div>
            <UserInfo />
        </Card>
    );
}

export { HotTopic };
