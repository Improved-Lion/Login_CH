// src/types/google.d.ts

interface Window {
  google: {
    accounts: {
      id: {
        initialize: (config: {
          client_id: string;
          callback: (response: { credential: string }) => void;
          auto_select?: boolean;
          cancel_on_tap_outside?: boolean;
        }) => void;
        prompt: (
          momentListener?: (notification: {
            isNotDisplayed: () => boolean;
            isSkippedMoment: () => boolean;
            getNotDisplayedReason: () => string;
            getSkippedReason: () => string;
          }) => void
        ) => void;
        renderButton: (element: HTMLElement, options: object) => void;
      };
      oauth2: {
        initCodeClient: (config: {
          client_id: string;
          scope: string;
          ux_mode: "popup" | "redirect";
          callback: (response: { code: string }) => void;
        }) => {
          requestCode: () => void;
        };
      };
    };
  };
}
