import StyledHeadlinePrimary from './style';
import { Link } from 'react-router-dom';
import { menuStructure } from '../constants';

const About = () => (
    <>
    <Link to={menuStructure.home.path}><StyledHeadlinePrimary>This is the most amazing hacker stories ever</StyledHeadlinePrimary></Link>
    </>
);

export default About;
