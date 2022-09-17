import React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {mainListItems, secondaryListItems} from './NavList';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Outlet, useNavigate } from 'react-router-dom';
import { List } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';


const drawerWidth = 240;
const color="#645CAA"

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

function DashboardContent() {
  const [open, setOpen] = React.useState(false);
  const nav=useNavigate();

  /*
  useEffect(()=>{ // auto signout if user leaves
    return()=>{
      //todo: add confirmation box
      Logout()
    }
  },[])*/

  const Logout=()=>{
        signOut(auth).then(()=>{
          console.log("dashboard leaving")
          nav("/")      
        })
      .catch((error) => {
        console.log(error.code)
      });
  }
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{pr: '24px', backgroundColor:color}}>{/*keep right padding when drawer closed*/}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{ marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
              Admin Dashboard
            </Typography>
            <IconButton color="inherit" onClick={Logout}>
                <ExitToAppIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        {/*header done */}

        <Drawer variant="permanent" open={open}>
          <Toolbar sx={{ display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}>

            <IconButton onClick={toggleDrawer}><ChevronLeftIcon /></IconButton>

        </Toolbar> 
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }}/>
            {secondaryListItems}
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'//nightmode
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}>
        <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 1, mb: 1 }}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                {/*Nested routing*/}
                <Outlet/>
              </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function ADashboard() {
  return <DashboardContent />;
}