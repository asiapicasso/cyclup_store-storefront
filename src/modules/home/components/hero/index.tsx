import { Link } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="h-[30vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 z-6 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-ui-fg-base font-normal"
          > Banner's title </Heading>
        </span>
        <a
          href="https://maps.app.goo.gl/Kd4JEZ164rgA1YyV8"
          target="_blank"
        >
          <Button variant="secondary">
            Notre showroom
            <Link />
          </Button>
        </a>
      </div>
    </div>
  )
}

export default Hero
