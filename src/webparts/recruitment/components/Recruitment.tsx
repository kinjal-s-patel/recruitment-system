import * as React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import AppRouter from './AppRouter';
import { IRecruitmentProps } from './/IRecruitmentProps';

const Home: React.FC<IRecruitmentProps> = (props) => {
  return (
    <Router>
      <AppRouter {...props} />
    </Router>
  );
};

export default Home;