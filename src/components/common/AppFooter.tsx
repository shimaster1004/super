import { Button, Separator } from "../ui";

function AppFooter() {
  return (
    <footer className="w-full flex items-center justify-center p-6 pb-20 bg-[#121212]">
      <div className="w-full max-w-[1328px] flex flex-col items-center justify-center gap-6">
        <div className="w-full flex flex-col items-start justify-between gap-6 md:flex-row">
          <div className="w-full flex items-start justify-between gap-4 md:w-fit md:flex-col ">
            <div className="flex flex-col">
              <h3 className="scroll-m-20 text-base md:text-2xl font-semibold tracking-tight">
                나의 학습 여정이,
              </h3>
              <h3 className="scroll-m-20 text-base md:text-2xl font-semibold tracking-tight">
                나만의 창작으로 이어지는 플랫폼
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size={"icon"}>
                <img src="/icons/youtube.svg" alt="@YOUTUBE" className="w-6" />
              </Button>
              <Button variant="secondary" size={"icon"}>
                <img
                  src="/icons/spotify.svg"
                  alt="@SPOTIFY"
                  className="w-5.5"
                />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p>이용약관</p>
            <Separator orientation="vertical" className="h-3!" />
            <p>개인정보처리방침</p>
            <Separator orientation="vertical" className="h-3!" />
            <p>클래스 론칭 문의</p>
          </div>
        </div>
        <Separator />
        <div className="w-full flex flex-col items-start gap-20 md:flex-row md:justify-between">
          <div className="flex flex-col gap-4">
            <p className="text-base font-semibold">고객센터</p>
            <div className="flex flex-col gap-13">
              <div className="flex flex-col gap-1">
                <p>평일 오전 9시 ~ 오후 6시</p>
                <p>문의 : mingoteam@naver.com</p>
              </div>
              <p>© Mingo Team all rights reserved</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-base font-semibold">사업자 정보</p>
            <div className="flex flex-col gap-1">
              <p>대표이사 : 박성재</p>
              <p>사업자 번호 : 696-48-01248</p>
              <p>통신판매신고번호 : 2025-서울서초-1014</p>
              <p>주소 : 서울특별시 서초구 서초대로 15길 33</p>
              <p>대표번호 : 070-8080-4429</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { AppFooter };
