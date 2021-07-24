import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  select: {
    minWidth: 300,
  },
}));

export default function CompaniesDropdown(props) {
  const classes = useStyles();

  return (
    <FormControl>
      <InputLabel id="demo-simple-select-label">Company</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={props.companyId}
        onChange={props.handleCompanyChange}
        className={classes.select}
      >
        {props.companies.map((company) => {
          return <MenuItem value={company.Id}>{company.Name}</MenuItem>;
        })}
      </Select>
    </FormControl>
  );
}
