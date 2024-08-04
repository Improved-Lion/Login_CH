import { useEffect } from "react";
import * as S from "@/components/login/Login.styled";
import useGoogleLogin from "@/hooks/useGoogleLogin";

const OtherLoginOptions = () => {
  const { handleGoogleLogin } = useGoogleLogin();

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.google && window.google.accounts) {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleLogin,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
        }
      };
    };

    loadGoogleScript();
  }, [handleGoogleLogin]);

  const handleGoogleButtonClick = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log("Google One Tap is not displayed or was skipped.");
          console.log(
            "Reason:",
            notification.getNotDisplayedReason() ||
              notification.getSkippedReason()
          );
        }
      });
    } else {
      console.error("Google API is not loaded");
    }
  };

  return (
    <>
      <S.SocialText>
        <S.HorizontalDivider />
        <span>다른 방법으로 로그인</span>
        <S.HorizontalDivider />
      </S.SocialText>

      <S.OtherLoginContainer>
        <S.OtherLoginButton onClick={handleGoogleButtonClick}>
          <S.OtherLoginIcon src="/google.webp" alt="Google" />
        </S.OtherLoginButton>
        <S.OtherLoginButton>
          <S.OtherLoginIcon src="/facebook.webp" alt="Facebook" />
        </S.OtherLoginButton>
        <S.OtherLoginButton>
          <S.OtherLoginIcon src="/github.webp" alt="GitHub" />
        </S.OtherLoginButton>
        <S.OtherLoginButton>
          <S.OtherLoginIcon src="/apple.webp" alt="Apple" />
        </S.OtherLoginButton>
      </S.OtherLoginContainer>
    </>
  );
};

export default OtherLoginOptions;
