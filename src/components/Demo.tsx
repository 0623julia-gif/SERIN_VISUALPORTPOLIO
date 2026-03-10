import LiquidGradient from "./ui/flow-gradient-hero-section";

export default function Demo() {
  return (
    <div className="w-full h-screen">
      <LiquidGradient 
        title="Liquid Flow" 
        ctaText="Get Started" 
        onCtaClick={() => console.log("Clicked!")} 
      />
    </div>
  );
}
