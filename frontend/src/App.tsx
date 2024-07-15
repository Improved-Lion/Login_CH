import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import router from "./routes/routes";

const queryClient = new QueryClient();

const App = () => {
  return (
    <>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<text>Loading...</text>}>
            <RouterProvider router={router}></RouterProvider>
          </Suspense>
          <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
      </HelmetProvider>
    </>
  );
};

export default App;
