import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import MenuIcon from "@material-ui/icons/Menu";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Person from "@material-ui/icons/Person";
import Assignment from "@material-ui/icons/Assignment";
import { selectUser } from "../appReducer";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 50,
  },
}));

export default function Header(props) {
  const classes = useStyles();
  const history = useHistory();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const user = useSelector(selectUser);

  function onSignOut() {
    localStorage.removeItem("eManageUser");
    localStorage.removeItem("eManageToken");
    history.push("/signin");
  }

  function onClickEmployees() {
    props.setManagePage("employees");
    localStorage.setItem("managePage", "employees");
    setDrawerOpen(false);
  }

  function onClickPositions() {
    localStorage.setItem("managePage", "positions");
    props.setManagePage("positions");
    setDrawerOpen(false);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            eManage
          </Typography>
          <div className={classes.grow} />
          <Typography variant="h6" className={classes.title}>
            {user.companyName}
          </Typography>
          <div className={classes.grow} />
          <Typography variant="h6" className={classes.title}>
            Hello, {user.username}
          </Typography>
          <Button color="inherit" onClick={onSignOut}>
            Signout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List>
          <ListItem button key={"employees"} onClick={onClickEmployees}>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary={"Employees"} />
          </ListItem>
          <ListItem button key={"positions"} onClick={onClickPositions}>
            <ListItemIcon>
              <Assignment />
            </ListItemIcon>
            <ListItemText primary={"Positions"} />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}
