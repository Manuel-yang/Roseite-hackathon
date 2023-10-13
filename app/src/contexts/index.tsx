import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { CommentsProvider } from "./CommentsContext";
import { TagsProvider } from "./TagsContext";
import { ThemeProvider } from "./ThemeContext";
import { TweetsProvider } from "./TweetsContext";
// import { UsersProvider } from "./UsersContext";
import { NftScannerProvider } from "./NftScannerContext";
import { NftAccountProvidr } from "./NftAccountContext";

const SolanaProvider = dynamic(
  () => import('./SolanaContext').then(({ SolanaProvider }) => SolanaProvider),
  { ssr: false },
);

export default function AppContext({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SolanaProvider>
        <NftScannerProvider>
          <NftAccountProvidr>
            <TweetsProvider>
              {/* <UsersProvider> */}
                <TagsProvider>
                  <CommentsProvider>{children}</CommentsProvider>
                </TagsProvider>
              {/* </UsersProvider> */}
            </TweetsProvider>
          </NftAccountProvidr>
        </NftScannerProvider>
      </SolanaProvider>
    </ThemeProvider>
  );
}
