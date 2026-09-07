import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppDropfile, { matchAccept } from '@/components/ui/form/AppDropfile';

describe('AppDropfile', () => {
  describe('matchAccept utility', () => {
    it('matches extensions correctly', () => {
      const pdf = new File([''], 'doc.pdf', { type: 'application/pdf' });
      const jpg = new File([''], 'photo.jpg', { type: 'image/jpeg' });

      expect(matchAccept(pdf, '.pdf')).toBe(true);
      expect(matchAccept(jpg, '.pdf')).toBe(false);
      expect(matchAccept(jpg, '.pdf,.jpg')).toBe(true);
    });

    it('matches wildcard MIME types', () => {
      const png = new File([''], 'image.png', { type: 'image/png' });
      const txt = new File([''], 'notes.txt', { type: 'text/plain' });

      expect(matchAccept(png, 'image/*')).toBe(true);
      expect(matchAccept(txt, 'image/*')).toBe(false);
    });

    it('matches exact MIME types', () => {
      const pdf = new File([''], 'doc.pdf', { type: 'application/pdf' });
      expect(matchAccept(pdf, 'application/pdf')).toBe(true);
      expect(matchAccept(pdf, 'image/png')).toBe(false);
    });

    it('returns true when accept is empty or wildcard', () => {
      const anyFile = new File([''], 'any.bin');
      expect(matchAccept(anyFile, undefined)).toBe(true);
      expect(matchAccept(anyFile, '')).toBe(true);
      expect(matchAccept(anyFile, '*')).toBe(true);
    });
  });

  describe('Component Rendering', () => {
    it('renders with default single file text and icons', () => {
      render(<AppDropfile />);

      expect(
        screen.getByText('CLIQUE OU ARRASTE O ARQUIVO AQUI')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Clique ou arraste o arquivo aqui')
      ).toBeInTheDocument();
    });

    it('renders multiple file texts when multiple is true', () => {
      render(<AppDropfile multiple />);
      expect(
        screen.getByText('CLIQUE OU ARRASTE ARQUIVOS AQUI')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Clique ou arraste arquivos aqui')
      ).toBeInTheDocument();
    });

    it('renders custom title, description, label and helperText', () => {
      render(
        <AppDropfile
          label="ARQUIVO PRINCIPAL"
          title="MEU TITULO CUSTOMIZADO"
          description="Apenas formato PDF"
          helperText="Tamanho maximo: 10MB"
        />
      );

      expect(screen.getByText('ARQUIVO PRINCIPAL')).toBeInTheDocument();
      expect(screen.getByText('MEU TITULO CUSTOMIZADO')).toBeInTheDocument();
      expect(screen.getByText('Apenas formato PDF')).toBeInTheDocument();
      expect(screen.getByText('Tamanho maximo: 10MB')).toBeInTheDocument();
    });

    it('renders error message and applies error styles', () => {
      render(
        <AppDropfile
          error="Formato de arquivo invalido"
          helperText="Texto auxiliar"
        />
      );

      expect(
        screen.getByText('Formato de arquivo invalido')
      ).toBeInTheDocument();
      expect(screen.queryByText('Texto auxiliar')).not.toBeInTheDocument();
    });
  });

  describe('File Processing & Events', () => {
    it('handles file input change with onFilesChange and onFileChange', () => {
      const handleFiles = jest.fn();
      const handleFile = jest.fn();

      const { container } = render(
        <AppDropfile
          onFilesChange={handleFiles}
          onFileChange={handleFile}
        />
      );

      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      fireEvent.change(input, { target: { files: [file] } });

      expect(handleFiles).toHaveBeenCalledWith([file]);
      expect(handleFile).toHaveBeenCalledWith(file);
    });

    it('handles drag and drop events', () => {
      const handleFiles = jest.fn();
      render(<AppDropfile onFilesChange={handleFiles} />);

      const dropzone = screen.getByRole('button');

      fireEvent.dragOver(dropzone);
      expect(dropzone).toHaveClass('border-secondary');

      const file = new File(['hello'], 'document.pdf', { type: 'application/pdf' });
      fireEvent.drop(dropzone, {
        dataTransfer: { files: [file] },
      });

      expect(handleFiles).toHaveBeenCalledWith([file]);
    });

    it('validates file type and invokes onReject for invalid types', () => {
      const handleFiles = jest.fn();
      const handleReject = jest.fn();

      const { container } = render(
        <AppDropfile
          accept=".pdf"
          onFilesChange={handleFiles}
          onReject={handleReject}
        />
      );

      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      const invalidFile = new File(['data'], 'image.png', { type: 'image/png' });

      fireEvent.change(input, { target: { files: [invalidFile] } });

      expect(handleFiles).not.toHaveBeenCalled();
      expect(handleReject).toHaveBeenCalledWith([
        { file: invalidFile, reason: 'type' },
      ]);
    });

    it('validates maxSize and invokes onReject when file is too large', () => {
      const handleFiles = jest.fn();
      const handleReject = jest.fn();

      const { container } = render(
        <AppDropfile
          maxSize={100}
          onFilesChange={handleFiles}
          onReject={handleReject}
        />
      );

      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      const largeFile = new File([new ArrayBuffer(200)], 'big.pdf', {
        type: 'application/pdf',
      });

      fireEvent.change(input, { target: { files: [largeFile] } });

      expect(handleFiles).not.toHaveBeenCalled();
      expect(handleReject).toHaveBeenCalledWith([
        { file: largeFile, reason: 'size' },
      ]);
    });

    it('limits to single file when multiple/many is false', () => {
      const handleFiles = jest.fn();
      const handleReject = jest.fn();

      const { container } = render(
        <AppDropfile
          multiple={false}
          onFilesChange={handleFiles}
          onReject={handleReject}
        />
      );

      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      const f1 = new File(['1'], 'file1.pdf', { type: 'application/pdf' });
      const f2 = new File(['2'], 'file2.pdf', { type: 'application/pdf' });

      fireEvent.change(input, { target: { files: [f1, f2] } });

      expect(handleFiles).toHaveBeenCalledWith([f1]);
      expect(handleReject).toHaveBeenCalledWith([{ file: f2, reason: 'count' }]);
    });

    it('enforces maxFiles when multiple is true', () => {
      const handleFiles = jest.fn();
      const handleReject = jest.fn();

      const { container } = render(
        <AppDropfile
          multiple
          maxFiles={2}
          onFilesChange={handleFiles}
          onReject={handleReject}
        />
      );

      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      const f1 = new File(['1'], 'f1.pdf', { type: 'application/pdf' });
      const f2 = new File(['2'], 'f2.pdf', { type: 'application/pdf' });
      const f3 = new File(['3'], 'f3.pdf', { type: 'application/pdf' });

      fireEvent.change(input, { target: { files: [f1, f2, f3] } });

      expect(handleFiles).toHaveBeenCalledWith([f1, f2]);
      expect(handleReject).toHaveBeenCalledWith([{ file: f3, reason: 'count' }]);
    });

    it('accumulates files when added one by one with multiple=true', () => {
      const handleFiles = jest.fn();

      const { container } = render(
        <AppDropfile multiple onFilesChange={handleFiles} />
      );

      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      const f1 = new File(['1'], 'first.pdf', { type: 'application/pdf' });
      const f2 = new File(['2'], 'second.pdf', { type: 'application/pdf' });

      fireEvent.change(input, { target: { files: [f1] } });
      expect(handleFiles).toHaveBeenLastCalledWith([f1]);

      fireEvent.change(input, { target: { files: [f2] } });
      expect(handleFiles).toHaveBeenLastCalledWith([f1, f2]);
    });

    it('displays and allows removing selected files when showSelectedFiles is true', () => {
      const handleFiles = jest.fn();
      const initialFile = new File(['12345'], 'sample.pdf', { type: 'application/pdf' });

      render(
        <AppDropfile
          defaultValue={[initialFile]}
          showSelectedFiles={true}
          onFilesChange={handleFiles}
        />
      );

      expect(screen.getByText('sample.pdf')).toBeInTheDocument();

      const removeBtn = screen.getByRole('button', { name: /Remover sample\.pdf/i });
      fireEvent.click(removeBtn);

      expect(screen.queryByText('sample.pdf')).not.toBeInTheDocument();
      expect(handleFiles).toHaveBeenCalledWith([]);
    });

    it('does not trigger events when disabled', () => {
      const handleFiles = jest.fn();
      const { container } = render(
        <AppDropfile disabled onFilesChange={handleFiles} />
      );

      const dropzone = screen.getByRole('button');
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.click(dropzone);
      const f1 = new File(['1'], 'f1.pdf', { type: 'application/pdf' });
      fireEvent.drop(dropzone, { dataTransfer: { files: [f1] } });
      fireEvent.change(input, { target: { files: [f1] } });

      expect(handleFiles).not.toHaveBeenCalled();
      expect(dropzone).toHaveClass('opacity-40', 'cursor-not-allowed');
    });
  });
});
