import * as React from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from './dashboard';
// import ClientForm from './clientform';
// import TotalClients from './totalclient';
// import ProspectFormPage from './prospectform';
// import TotalProspects from './totalprospects';
// import GenerateAgreementForm from './agreementform';

// import { IProspectClientProps } from './IProspectClientProps';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IRecruitmentProps } from './IRecruitmentProps';

// Define the props interface expected by AppRouter.
// It should include context since you want to pass it to child components.
interface IAppRouterProps extends IRecruitmentProps {
  context: WebPartContext;
}

const AppRouter: React.FC<IAppRouterProps> = (props) => {
  const { context, ...restProps } = props;

  return (
    <Routes>
      <Route path="/" element={<Dashboard {...restProps} context={context} />} />


    </Routes>
  );
};

export default AppRouter;
