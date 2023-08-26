import * as React from 'react';
import {
  DataGrid,
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridRowsProp,
  GridColDef,
} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import styles from './ProofGrid.module.css'
import 'mathlive';

export function MathFieldWrapper() {
  return (
    <math-field class={styles.mathField}>f(x) = 5</math-field>
  );
}

const columns: GridColDef[] = [
  { field: 'id', headerName: '#', width: 80 },
  { field: 'statement', headerName: 'Statement', width: 350, renderCell: () => <MathFieldWrapper className={styles.field} /> },
  { field: 'reason', headerName: 'Reason', type: 'string', width: 350, editable: true },
];

let idCounter = 3;
const createBlankRow = () => {
  idCounter += 1;
  return { id: idCounter, statement: '', reason: '' };
};

export default function ProofGrid() {
  const [cellModesModel, setCellModesModel] = React.useState<GridCellModesModel>({});

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
                {},
              ),
            }),
            {},
          ),
          [params.id]: {
            // Revert the mode of other cells in the same row
            ...Object.keys(prevModel[params.id] || {}).reduce(
              (acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }),
              {},
            ),
            [params.field]: { mode: GridCellModes.Edit },
          },
        };
      });
    },
    [],
  );

  const handleCellModesModelChange = React.useCallback(
    (newModel: GridCellModesModel) => {
      setCellModesModel(newModel);
    },
    [],
  );

  const [rows, setRows] = React.useState(() => [
    {
      id: 1,
      statement: 'AC = BC',
      reason: 'Pythagoras is a genius!',
    },
    {
      id: 2,
      statement: '6x = 15',
      reason: 'I am very clever!',
    },
    {
      id: 3,
      statement: 'ABCD is a square',
      reason: 'Well, it is obvious...',
    },
  ]);

  const handleAddRow = () => {
    setRows(prevRows => [...prevRows, createBlankRow()]);
  };

  return (
    <div style={{ width: '80%', margin: 'auto', marginTop: '5vh', marginBottom: '5vh' }}>
      <Button size="small" onClick={handleAddRow}>
        Add a row
      </Button>
      <DataGrid
        rows={rows}
        columns={columns}
        cellModesModel={cellModesModel}
        onCellModesModelChange={handleCellModesModelChange}
        onCellClick={handleCellClick}
      />
    </div>
  );
}
