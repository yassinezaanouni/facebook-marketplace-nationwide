"use client"

import Image from "next/image"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface ModeCarouselProps {
  isCollectorMode: boolean
}

interface ImageInfo {
  src: string
  title: string
  buyPrice: string
  sellPrice: string
}

const collectorImages: ImageInfo[] = [
  {
    src: "/carousel/collector/title_technic_42126_buy_for_$75_compare_at_$160.webp",
    title: "Technic 42126",
    buyPrice: "75",
    sellPrice: "160",
  },
  {
    src: "/carousel/collector/title_macho_man_wwe_action_figure_buy_$28_compare_at_$75.webp",
    title: "Macho Man WWE Action Figure",
    buyPrice: "28",
    sellPrice: "75",
  },
  {
    src: "/carousel/collector/title_lego_star_wars_9488_buy_$78_compare_at_$170.webp",
    title: "Lego Star Wars 9488",
    buyPrice: "78",
    sellPrice: "170",
  },
  {
    src: "/carousel/collector/title_funko_pop_gamer_bart_buy_$25_comapre_at_$50.webp",
    title: "Funko Pop Gamer Bart",
    buyPrice: "25",
    sellPrice: "50",
  },
  {
    src: "/carousel/collector/title_carl_grimes_action_figure_buy_$75_compare_at_$120.webp",
    title: "Carl Grimes Action Figure",
    buyPrice: "75",
    sellPrice: "120",
  },
  {
    src: "/carousel/collector/title_barbie_cher_vintage_buy_$180_compare_at_$350.webp",
    title: "Barbie Cher Vintage",
    buyPrice: "180",
    sellPrice: "350",
  },
]

const flipperImages: ImageInfo[] = [
  {
    src: "/carousel/flipper/title_radica_poker_vintage_game_buy_$30_sell_$65.webp",
    title: "Radica Poker Vintage Game",
    buyPrice: "30",
    sellPrice: "65",
  },
  {
    src: "/carousel/flipper/title_panasonic_cassette_player_buy_$125_sell_$215.webp",
    title: "Panasonic Cassette Player",
    buyPrice: "125",
    sellPrice: "215",
  },
  {
    src: "/carousel/flipper/title_logiteh_650_harmony_buy_$130_sell_$290.webp",
    title: "Logitech 650 Harmony",
    buyPrice: "130",
    sellPrice: "290",
  },
  {
    src: "/carousel/flipper/title_i_love_lucy_dvd_buy_$22_sell_$52.webp",
    title: "I Love Lucy DVD",
    buyPrice: "22",
    sellPrice: "52",
  },
  {
    src: "/carousel/flipper/title_canon_ powershot_sd750_buy_$55_sell_$180.webp",
    title: "Canon Powershot SD750",
    buyPrice: "55",
    sellPrice: "180",
  },
  {
    src: "/carousel/flipper/title_brunswick_pro_bowling_ps4_buy_$23_sell_$65.webp",
    title: "Brunswick Pro Bowling PS4",
    buyPrice: "23",
    sellPrice: "65",
  },
]

export function ModeCarousel({ isCollectorMode }: ModeCarouselProps) {
  const images = isCollectorMode ? collectorImages : flipperImages

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="p-2"
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index} className="basis-1/2 lg:basis-1/3">
            <Card className="border-none bg-primary/3 gap-0 py-3 h-full">
              <CardHeader className="p-0">
                <div className="overflow-hidden rounded-t-xl">
                  <Image
                    src={image.src}
                    alt={image.title}
                    width={300}
                    height={125}
                    className="object-contain max-h-[150px]"
                    priority={index < 3}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <CardTitle className="text-sm line-clamp-1">
                  {image.title}
                </CardTitle>
                <div className="flex justify-between items-center mt-2">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Buy for
                    </span>
                    <span className="text-base font-semibold ml-1">
                      ${image.buyPrice}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">
                      {isCollectorMode ? "Compare at" : "Sell for"}
                    </span>
                    <span className="text-lg font-semibold text-primary ml-1">
                      ${image.sellPrice}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
