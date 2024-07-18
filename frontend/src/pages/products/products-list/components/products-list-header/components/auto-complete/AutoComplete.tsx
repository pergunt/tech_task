import { useState, FC } from "react";
import { API } from "configs";
import {
  TextField,
  CircularProgress,
  Autocomplete,
  AutocompleteProps,
} from "@mui/material";

type AutoCompleteProps = Pick<
  AutocompleteProps<string, false, true, false>,
  "onChange" | "value"
>;

const AutoComplete: FC<AutoCompleteProps> = ({ value, onChange }) => {
  const [state, setState] = useState<{
    options: string[];
    loading: boolean;
  }>({
    options: [],
    loading: false,
  });

  return (
    <Autocomplete<string, false, true, false>
      data-testid="category-autocomplete"
      sx={{ flexBasis: 200 }}
      options={state.options}
      loading={state.loading}
      value={value}
      onChange={onChange}
      onOpen={async () => {
        if (!state.options.length) {
          setState((prevState) => ({
            ...prevState,
            loading: true,
          }));

          try {
            const { data } = await API.get(`/category-list`);

            setState((prevState) => ({
              ...prevState,
              loading: false,
              options: data,
            }));
          } catch (e) {
            setState((prevState) => ({
              ...prevState,
              loading: false,
            }));
          }
        }
      }}
      renderInput={(props) => (
        <TextField
          {...props}
          label="Category"
          variant="standard"
          InputProps={{
            ...props.InputProps,
            endAdornment: (
              <>
                {state.loading ? (
                  <CircularProgress color="inherit" size={10} />
                ) : null}
                {props.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default AutoComplete;