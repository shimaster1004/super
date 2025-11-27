import { NavLink, useNavigate } from "react-router";
import supabase from "@/utils/supabase";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthStore } from "@/store/auth";

const formSchema = z.object({
  email: z.email("올바른 형식의 이메일 주소를 입력해주세요."),
  password: z.string().min(8, {
    message: "비밀번호는 최소한 8자 이상으로 작성해주세요.",
  }),
});

function SignIn() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  // 일반 로그인
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const {
        data: { user, session },
        error: signInError,
      } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        toast.error(
          signInError.message === "Invalid login credentials"
            ? "입력하신 정보가 일치하지 않습니다."
            : "로그인 중 오류가 발생하였습니다."
        );
        return;
      }

      console.log("user: ", user);
      console.log("session: ", session);

      // user와 session 두 값 모두 null이 아닐 경우에만 로그인이 완료되었음을 의미
      if (user && session) {
        // 로그인 성공 시,
        setUser({
          id: user.id,
          email: user.email,
          role: user.role,
        });
        toast.success("로그인을 완료하였습니다.");
        navigate("/"); // => 메인 페이지로 리디렉션
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // 소셜 로그인 (구글)
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${import.meta.env.VITE_BASE_URL}/auth/callback`,
          // 구글 OAuth 로그인 시 추가로 전달되는 파라미터, 토큰 발급 방식과 사용자 동의 화면에 영향을 줍니다.
          // access_type: 리프레시 토큰(refresh token)을 발급받기 위한 설정입니다.
          // 일반적으로 OAuth 로그인에서는 access token만 발급되는데, 이 토큰은 시간이 지나면 만료됩니다.
          // access_type: "offline"을 사용하면 => 사용자가 애플리케이션을 사용하지 않을 때도(refresh)
          // 새 access token을 발급할 수 있게 해주는 리프레시 토큰을 받을 수 있습니다.

          // prompt: "consent"
          // 구글이 항상 동의 화면을 다시 보여주도록 강제하는 설정입니다.
          // 일반적으로 사용자가 한 번 동의하면 구글은 다음에 자동으로 스킵하는데,
          // 이 옵션을 쓰면 매번 동의 화면이 다시 뜹니다.
          // 이것을 넣는 이유는 보통 리프레시 토큰을 항상 확실하게 받기 위해서입니다.
          // => "사용자에게 다시 동의를 요청해라"라는 의미

          // access_type: "offline" => 리프레시 토큰 요청 => 장기 로그인 유지, 백엔드에서 재인증 없이 접근하고자 함
          // prompt: "consent" => 동의 화면을 강제로 다시 표시 => 리프레시 토큰을 안정적으로 받기 위함
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <div className="w-full max-w-[1328px] h-full flex items-center justify-center">
      <Card className="w-full max-w-sm border-0 bg-transparent">
        <CardHeader className="gap-0">
          <CardTitle className="text-lg">로그인</CardTitle>
          <CardDescription>로그인을 위한 정보를 입력해주세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input placeholder="이메일을 입력하세요." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>비밀번호</FormLabel>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        비밀번호를 잊으셨나요?
                      </a>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="비밀번호를 입력하세요."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  로그인
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                >
                  <img src="/icons/google.svg" alt="@GOOGLE" className="w-4" />
                  구글 로그인
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="w-full flex items-center justify-center gap-2 -mt-3">
            <p>계정이 없으신가요?</p>
            {/* <Button variant={"link"} className="p-0 underline" onClick={() => navigate("/sign-up")}>
                            회원가입
                        </Button> */}
            <NavLink to={"/sign-up"} className="underline underline-offset-4">
              회원가입
            </NavLink>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignIn;
