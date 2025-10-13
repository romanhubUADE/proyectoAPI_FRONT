export default function Home() {
  return (
    <main className="flex-1">
      {/* HERO */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="relative flex min-h-[480px] items-center justify-center overflow-hidden
                       rounded-xl bg-cover bg-center p-8 text-center"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBSfetmgcEEAPqxn90x0d4neJA5JipPFfgpYlgL4mU2dKmIghVxndjkaq_klTgQVjHsWal3yO9o1IKNbR_WlUwcOkVT5GxkLOArd0l_sbF4r81vrV8F4bLuy1emgFGZrWH8clsIvvJRXez3BSAE2C_YKuDPPTzCmDfFGBObaYgrttUmJjMSzuXO_0UcR7hSc9kbXRKJFZ2o8hfPZgYF82bWBjAj8WuE-KZY1mSHVbSfcwiAZBIOJMsOC3b_zDSfJAlIg1P17Bujblc")',
            }}
          >
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col gap-2 text-white">
                <h1 className="text-4xl font-extrabold md:text-6xl">Find Your Perfect Sound</h1>
                <p className="text-base font-light md:text-lg">
                  Explore our curated collection of guitars, crafted for every style and skill level.
                </p>
              </div>
              <a
                href="/catalog"
                className="rounded-lg bg-primary px-8 py-3 text-base font-bold text-white transition hover:bg-primary/80"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Featured Guitars</h2>
          <div className="mt-6">
            <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 no-scrollbar">
              {[
                {
                  title: "The 'Prairie Song' Acoustic",
                  text: "Warm tones and classic design, perfect for folk and country.",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbyAw1shFLNrByQTuJUfCswlhCQApIemwNPM1O9P_L30Gummo2qXrqGX4rpy-dSoC7iVKjZP6oZLtCwQ7txo_v5fKQbgJul8944hF7ZvFJor6rhY4wUIgT8GGsyOxEXChvybbfR2TGsR-t21WoBtNc4t14wzllEKCIxL-Zw6C-8t6px-9WpxdSo93y0jjPns69pWTI6hgeimgsjOhpgnLwkLndL9Oz7sTHVfCzOaQ66ft88TiyanXcoE8hENaJHnzAOKO8xcjQCDg",
                },
                {
                  title: "The 'Midnight Rider' Electric",
                  text: "Powerful sound and sleek design, ideal for rock and blues.",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDc3YoEwzEII_0C0dsYKn16VYxIJZR7WOgIxADOQ36c64hGUn1XhqMxDNAZhvPiPpOFllp6XHQ-eOgThgVclm02ZUnE7aNuxAgrTKfVTjMuydjVjNQAIaovP4PXuP531hRKBDkGGFH4BmiGweHxAxF85q_TDjuTkoYgsTg-aI4VKnYhMp0B1NlUCCJCiCzSvPnIfVxW-x8v5qUcnV_p2ytLQwkk0R0zi0q5X8YS1977ovB9aITY-rJx9K0FT_d3-BqvMiJkc6FXOLk",
                },
                {
                  title: "The 'Thunder Road' Bass",
                  text: "Deep, resonant bass with a comfortable feel for any genre.",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMVm6UaGcXN1cCxCC9Hx6Cv6HTkhWExLmaCBubUrqrbtYSj8bgz7SlVA7cgjlSeuBu5mR3DobuEzhKFvnapIjF68bb2CZQjpDlltmLJ2oZpcS6JzFM4I7wPPLShxA5t8mDRnSYqsmwMmFjaOMTVaS79qf9deXtOXrRHNxTP76w6muc-Rwr1MD8X8kVvk63snTzlbL3ypF60ZkUX6z0g2lF60inSdAjCOUNngLqI314t2iEcn1E9TtJp78IM-qAxncnVx3BALf1kKA",
                },
              ].map((c) => (
                <div key={c.title} className="w-2/3 flex-shrink-0 snap-center sm:w-1/3">
                  <div className="group flex cursor-pointer flex-col gap-4">
                    <div className="aspect-video w-full overflow-hidden rounded-lg">
                      <img
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        src={c.img}
                        alt={c.title}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-900 dark:text-white">{c.title}</h3>
                      <p className="text-sm text-stone-600 dark:text-stone-400">{c.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Shop by Category</h2>
          <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              {
                title: "Acoustic Guitars",
                text: "Explore our range of acoustic guitars.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJrIylck-_TSgSDirpXHOfdt1uv835vHVw3odnmBaNB_lcYNckSLAlmFoK_eXrrsjG8C0c2irKLty2K5Nhfg_EyiYEy8EMTSo0Wy092fXNr2heG3F40q1hzqALMGnIZ6SdImImWd5aa5-yfmTvUgesyIJqiL4WBL1rvln95_YCA_M1eG4Mh-s55WU_B3XSiJuE8iIyxJH2ALWDJvzCdubVW7KA3wdaSOvU68T_B2_eBJUKqCnfGvujSmvero-vhOmSsvIRRpeiKZM",
              },
              {
                title: "Electric Guitars",
                text: "Discover our selection of electric guitars.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZh1SmUPXygK5USePgwL7LPF4vHkS1QIHzyVbs1jbHXtQ-wJIkH2BoRPJwX1YKY9BAYfJ4sdru-FOtytDlZmyOyTv0i8bQUUBdnWmZ4fS2l_o243vL9gVU801I_5iGNMLb4u8xbtrS41hdOftpb2pPtoAjfvEv9cFH4R_Q50wBKFE8eD7RBACwRXLQSOBC8GsBMiar8wNKtq-r8gIKRB2Td7Byowz4F3pJ5QM3A8OtJ5sScjHAEcI6Sg0G7hLR2t_p_FdZz_MSLZE",
              },
              {
                title: "Bass Guitars",
                text: "Find the perfect bass guitar for your style.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqnpHQE5yhMjM5ZOSN1dQUs-aGIgzx4iMtTyk3J1pcIYwH8by3PyAx02riMLYf7OIn-KuP43RtnL_qNkIRzQS2Sv852HnAAlNFnUmZhF39yzc30W80GKjBhK2hhJl_PLvX0nsOgiWgCJYFRyUYwSywt0LUEPsIi9VGG_cDCtmyYejC72HEqFOmYAym8Iyv4If-5LaVNsF0ZwaVZ_56qtqe1ZN3fnrtW38IJbWFRDQ9HlnM4AeoGFLYZA-_IWU9mhQoLoIBaBGMWvA",
              },
              {
                title: "Classical Guitars",
                text: "Browse our collection of classical guitars.",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtyY0bkF6ZL82jwDNpgIbvqLcuFCaBIvTK8mrv7X_PvGiFsha9g6t45Q5fkr_yWr9E1OUgNNTHGzid8xsQCt14YbEcFFMn7x2T0QdHuet4bTQ9cMh9lVvv08_YLOrcUrg3tfVec2Wi8k9IqFnMb2wiXMX639yRDzfZ1EsvAyRIVuMPSSa3aSH5kxJeKH6Ymz1exadlmwQ6nuxa8Quxfha-Qc_B42dN-mtIggtKake5l8BaT7u2DLf2stKAaNqW1NPWcBY_F8t0dNE",
              },
            ].map((c) => (
              <a key={c.title} className="group flex flex-col gap-4" href="/catalog">
                <div className="aspect-square w-full overflow-hidden rounded-lg">
                  <img
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    src={c.img}
                    alt={c.title}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 dark:text-white">{c.title}</h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400">{c.text}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
