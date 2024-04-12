import Header from "@/components/header";
import { MenuContext } from "./context";
import Footer from "@/components/footer";

export function Layout({
    children,
    showMenu,
    setMenu,
    menu = '',
  }: Readonly<{
    children: React.ReactNode;
    showMenu?: boolean;
    setMenu?: (item: string) => void;
    menu?: string;
  }>) {
    return (
      <>
        <Header onSelect={setMenu} showMenu={!!showMenu} />
          <MenuContext.Provider value={menu}>{children}</MenuContext.Provider>
        <Footer />
      </>
    );
  }