import Container from "../components/Container";

export default function Home() {
  return (
    <Container
      heading="desenvolvedor criativo pronto para criar algo incrivel"
      heroSrc="/images/giphy.gif"
    >
      <div className="flex flex-col justify-center items-start max-w-4xl mx-auto mb-16 py-8">
        <h1 className="font-bold text-3xl md:text-6xl tracking-tight mb-4 text-gray-700">
          Lorem ipsum dolor sit.
        </h1>
        <h2 className="text-gray-600 mb-16">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae
          suscipit quisquam atque quidem aut, dignissimos ut eaque eos
          provident, tempora vitae sed optio at et aperiam a amet, nesciunt
          cupiditate!
        </h2>
      </div>
    </Container>
  );
}
