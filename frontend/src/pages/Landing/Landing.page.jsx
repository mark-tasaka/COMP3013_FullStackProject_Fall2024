import { Container } from "@mantine/core";
import {LandingPageImage} from "./Images.landingPage.jsx";
import classes from './Landpage.module.css';

//Mark Tasaka
const Landing = () => {
  
  return (
    <Container>
      <h1 className={classes.titleFormat}>COMP 3013 Full Stack Lab</h1>
      <LandingPageImage/>
    </Container>
  );
};

export default Landing;
