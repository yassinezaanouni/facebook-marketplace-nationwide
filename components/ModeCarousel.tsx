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
    src: "/carousel/collector/technic_42126.webp",
    title: "Technic 42126",
    buyPrice: "75",
    sellPrice: "160",
  },
  {
    src: "/carousel/collector/macho_man_wwe_action_figure.webp",
    title: "Macho Man WWE Action Figure",
    buyPrice: "28",
    sellPrice: "75",
  },
  {
    src: "/carousel/collector/lego_star_wars_9488.webp",
    title: "Lego Star Wars 9488",
    buyPrice: "78",
    sellPrice: "170",
  },
  {
    src: "/carousel/collector/funko_pop_gamer_bart.webp",
    title: "Funko Pop Gamer Bart",
    buyPrice: "25",
    sellPrice: "50",
  },
  {
    src: "/carousel/collector/carl_grimes_action_figure.webp",
    title: "Carl Grimes Action Figure",
    buyPrice: "75",
    sellPrice: "120",
  },
  {
    src: "/carousel/collector/barbie_cher_vintage.webp",
    title: "Barbie Cher Vintage",
    buyPrice: "180",
    sellPrice: "350",
  },
]

const flipperImages: ImageInfo[] = [
  {
    src: "/carousel/flipper/radica_poker_vintage_game.webp",
    title: "Radica Poker Vintage Game",
    buyPrice: "30",
    sellPrice: "65",
  },
  {
    src: "/carousel/flipper/panasonic_cassette_player.webp",
    title: "Panasonic Cassette Player",
    buyPrice: "125",
    sellPrice: "215",
  },
  {
    src: "/carousel/flipper/logitech_650_harmony.webp",
    title: "Logitech 650 Harmony",
    buyPrice: "130",
    sellPrice: "290",
  },
  {
    src: "/carousel/flipper/i_love_lucy_dvd.webp",
    title: "I Love Lucy DVD",
    buyPrice: "22",
    sellPrice: "52",
  },
  {
    src: "/carousel/flipper/canon_powershot_sd750.webp",
    title: "Canon Powershot SD750",
    buyPrice: "55",
    sellPrice: "180",
  },
  {
    src: "/carousel/flipper/brunswick_pro_bowling_ps4.webp",
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
