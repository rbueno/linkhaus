import { paramCase } from 'change-case';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Container, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// _mock_
import { _userList } from '../../../../_mock/arrays';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import { useAuthContext } from '../../../../auth/useAuthContext';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
import UserNewEditForm from '../../../../sections/@dashboard/business/UserNewEditForm';

// ----------------------------------------------------------------------

UserEditPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function UserEditPage() {
  const { themeStretch } = useSettingsContext();

  const { query } = useRouter();

  const { name } = query;
  const { workspaces, currentWorkspace } = useAuthContext()
  const editingWorkspace = workspaces.find((ws) => paramCase(ws._id) === name);

  return (
    <>
      <Head>
        <title> User: Edit user | Linkhaus UI</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
      <Typography variant="h4" sx={{ mb: 5}}>Editar negócio</Typography>

        {/* <HeaderBreadcrumbs
          heading="Edit user"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.list },
            { name: capitalCase(name) },
          ]}
        /> */}

        <UserNewEditForm isEdit editingWorkspace={currentWorkspace} />
      </Container>
    </>
  );
}
