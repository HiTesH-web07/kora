import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Story } from "@/components/Story";
import { Menu } from "@/components/Menu";
import { Signature } from "@/components/Signature";
import { Gifting } from "@/components/Gifting";
import { Moments } from "@/components/Moments";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { Toast } from "@/components/Toast";
import { Splash } from "@/components/Splash";
import { ConfigProvider } from "@/store/config";
import { publicSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default function Home() {
  const config = publicSettings();
  return (
    <ConfigProvider value={config}>
      <Splash />
      <Nav />
      <main>
        <Hero />
        <Story />
        <Menu />
        <Signature />
        <Gifting />
        <Moments />
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
    </ConfigProvider>
  );
}
