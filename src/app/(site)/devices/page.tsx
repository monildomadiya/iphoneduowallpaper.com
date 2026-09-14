import type { Metadata } from "next";
import Link from "next/link";
import { DeviceTiles } from "@/components/site/tiles";
import { EmptyState, PageHeader } from "@/components/ui/primitives";
import { getDevices } from "@/lib/data/taxonomy";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Wallpapers by Device — iPhone Duo, iPhone 18 Pro & Pro Max",
    description:
      "Wallpapers sized for each screen: iPhone Duo outer display (1398 × 2034), inner display (2670 × 1878), iPhone 18 Pro Max (1320 × 2868) and iPhone 18 Pro (1206 × 2622).",
    path: "/devices",
  });
}

export default async function DevicesPage() {
  const devices = await getDevices();

  return (
    <>
      <PageHeader
        eyebrow="Devices"
        title="The right size for every screen."
        description="iPhone Duo has two displays with very different shapes. Pick your screen to see wallpapers that fit it pixel for pixel."
      />
      <section className="container-apple">
        {devices.length ? (
          <>
            <DeviceTiles devices={devices} />
            <div className="mt-16 overflow-x-auto rounded-[28px] bg-surface p-2">
              <table className="w-full min-w-[560px] text-left text-[15px]">
                <caption className="px-5 pb-2 pt-4 text-left text-[19px] font-semibold tracking-tight text-fg">
                  Screen resolutions at a glance
                </caption>
                <thead className="text-[13px] text-fg-3">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">Device</th>
                    <th scope="col" className="px-5 py-3 font-medium">Size</th>
                    <th scope="col" className="px-5 py-3 font-medium">Resolution</th>
                    <th scope="col" className="px-5 py-3 font-medium">Density</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {devices.map((device) => (
                    <tr key={device.id}>
                      <td className="px-5 py-3.5 font-medium">
                        <Link href={`/devices/${device.slug}`} className="hover:text-link">
                          {device.name}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-fg-2">{device.diagonal_in ? `${device.diagonal_in}-inch` : "—"}</td>
                      <td className="px-5 py-3.5 text-fg-2">
                        {device.width} × {device.height} px
                      </td>
                      <td className="px-5 py-3.5 text-fg-2">{device.ppi ? `${device.ppi} ppi` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-[14px] text-fg-3">
              Want the details? Read{" "}
              <Link href="/blog/iphone-duo-wallpaper-sizes-explained" className="link-apple">
                iPhone Duo wallpaper sizes explained
              </Link>
              .
            </p>
          </>
        ) : (
          <EmptyState title="Device list coming soon" description="We are adding screen specs for every supported iPhone." />
        )}
      </section>
    </>
  );
}
