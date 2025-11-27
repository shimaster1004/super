import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/auth";
import supabase from "@/utils/supabase";
import { Button, Spinner } from "@/components/ui";

function AuthCallback() {
    // Zustand(또는 다른 상태 관리 라이브러리)에서 사용자 정보를 설정하는 함수를 가져옵니다.
    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();

    // 컴포넌트 마운트 시에만 실행되도록 useEffect의 의존성은 비워둡니다. ([])
    useEffect(() => {
        // 1. 초기 세션 확인 (Initial Session Check)
        // - 애플리케이션이 로드되거나 새로고침 되었을 때, Supabase에 저장된 현재 세션 정보를 확인합니다.
        // - 세션이 유효하다면, 그 즉시 전역 상태(Zustand Store)에 사용자 정보를 설정합니다.
        const checkSession = async () => {
            // 현재 세션 정보를 비동기적으로 가져옵니다.
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                // 세션과 사용자 정보가 존재하면,
                if (session?.user) {
                    // 전역 상태에 사용자 정보를 업데이트 합니다.
                    // 타입스크립트 환경이므로 role과 email은 string으로 단언(assertion) 처리합니다.
                    setUser({
                        id: session.user.id,
                        email: session.user.email as string,
                        role: session.user.role as string,
                    });
                    setTimeout(() => {
                        navigate("/");
                    }, 2000);
                }
                // 세션이 없다면, setUser(null)을 할 필요는 없습니다. 리스너가 처리할 것입니다.
            } catch (error) {
                console.log(error);
                throw error;
            }
        };

        // 초기 세션 확인 함수를 즉시 호출합니다.
        checkSession();
    }, []);

    return (
        <div className="w-full max-w-[1328px] h-full flex items-center justify-center">
            <Button disabled size="sm">
                <Spinner />
                로그인 중...
            </Button>
        </div>
    );
}

export default AuthCallback;
