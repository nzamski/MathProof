import * as React from "react";
import {
  DataGrid,
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridRowsProp,
  GridColDef,
  GridActionsCellItem,
  GridRowId,
  GridToolbarContainer,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import styles from "./ProofGrid.module.css";
import "mathlive";
import { randomId } from "@mui/x-data-grid-generator";

export function MathFieldWrapper({ initialValue, onValueChange }) {
  const [value, setValue] = React.useState(initialValue);

  return (
    <math-field
      class={styles.mathField}
      onInput={(evt) => {
        setValue(evt.target.value);
        onValueChange(evt.target.value);
      }}
    >
      {value}
    </math-field>
  );
}

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      { id, statement: "", reason: "", isNew: true },
    ]);
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function ProofGrid() {
  const [cellModesModel, setCellModesModel] =
    React.useState<GridCellModesModel>({});

  const handleCellClick = React.useCallback(
    (params: GridCellParams, event: React.MouseEvent) => {
      if (!params.isEditable) {
        return;
      }

      // Ignore portal
      if (!event.currentTarget.contains(event.target as Element)) {
        return;
      }

      setCellModesModel((prevModel) => {
        return {
          // Revert the mode of the other cells from other rows
          ...Object.keys(prevModel).reduce(
            (acc, id) => ({
              ...acc,
              [id]: Object.keys(prevModel[id]).reduce(
                (acc2, field) => ({
                  ...acc2,
                  [field]: { mode: GridCellModes.View },
                }),
                {}
              ),
            }),
            {}
          ),
          [params.id]: {
            // Revert the mode of other cells in the same row
            ...Object.keys(prevModel[params.id] || {}).reduce(
              (acc, field) => ({
                ...acc,
                [field]: { mode: GridCellModes.View },
              }),
              {}
            ),
            [params.field]: { mode: GridCellModes.Edit },
          },
        };
      });
    },
    []
  );

  const handleCellModesModelChange = React.useCallback(
    (newModel: GridCellModesModel) => {
      setCellModesModel(newModel);
    },
    []
  );

  const [rows, setRows] = React.useState(() => [
    {
      id: 1,
      statement: "AC=BC",
      reason: "Pythagoras is a genius!",
    },
    {
      id: 2,
      statement: "f\\left(x\\right)=x^2-6x+2",
      reason: "I am very clever!",
    },
    {
      id: 3,
      statement: "x=42",
      reason: "Well, it is obvious...",
    },
  ]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "#", width: 80 },
    {
      field: "statement",
      headerName: "Statement",
      width: 350,
      renderCell: (params: GridRenderCellParams) => {
        const handleValueChange = (newStatement) => {
          setRows((oldRows) => {
            oldRows.find((row) => row.id === params.row.id).statement =
              newStatement;
            return oldRows;
          });
        };

        return (
          <MathFieldWrapper
            className={styles.field}
            initialValue={params.value}
            onValueChange={handleValueChange}
          />
        );
      },
    },
    {
      field: "reason",
      headerName: "Reason",
      type: "string",
      width: 350,
      editable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  return (
    <div
      style={{
        width: "80%",
        margin: "auto",
        marginTop: "5vh",
        marginBottom: "5vh",
      }}
    >
      <Box
        sx={{
          height: 500,
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          cellModesModel={cellModesModel}
          onCellModesModelChange={handleCellModesModelChange}
          onCellClick={handleCellClick}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows },
          }}
        />
      </Box>
    </div>
  );
}
