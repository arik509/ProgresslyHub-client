import Banner from "../components/Banner";
import Hero from "../components/Hero";
import Categories from "./Categories";
import Features from "./Features";
import Highlights from "./Highlights";
import Statistics from "./Statistics";
import Testimonials from "./Testimonials";

const Home = () => {
  return (
    <div>
      <Hero></Hero>
      <Features></Features>
      <Categories></Categories>
      <Highlights></Highlights>
      <Statistics></Statistics>
      <Testimonials></Testimonials>
    </div>
  );
};

export default Home;
