/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { DataTable } from '../../components/dataTable/dataTable';
import { getFiles } from '../../services/fileServices';

jest.mock('../../services/fileServices');

describe('DataTable Component', () => {
  it('should fetch and transform data correctly', async () => {
    getFiles.mockResolvedValue([
      {
        file: 'test.csv',
        lines: [
          { text: 'Sample Text 1', number: 123, hex: 'abc123' },
          { text: 'Sample Text 2', number: 456, hex: 'def456' },
        ],
      },
    ]);

    render(<DataTable />);

    expect(getFiles).toHaveBeenCalledTimes(1);

    const rows = await screen.findAllByRole('row');
    expect(rows).toHaveLength(3);

    const cells = await screen.findAllByRole('cell');
    expect(cells).toHaveLength(8);
  });

  it('should handle no data scenario', async () => {
    getFiles.mockResolvedValue([]);

    render(<DataTable />);

    expect(await screen.findByText('No data available.')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getFiles.mockRejectedValue(new Error('API error'));

    render(<DataTable />);

    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching data:',
        expect.any(Error)
      )
    );

    consoleSpy.mockRestore();
  });
});
