import { Produto } from '@/../../shared/const';
import { Button } from '@/components/ui/button';
import { Download, FileJson, FileText, FileSpreadsheet } from 'lucide-react';
import { exportarCSV, exportarJSON, exportarHTML } from '@/lib/exportUtils';
import { toast } from 'sonner';

interface ExportarBotoesProps {
  produtos: Produto[];
}

export default function ExportarBotoes({ produtos }: ExportarBotoesProps) {
  const handleExportarCSV = () => {
    try {
      exportarCSV(produtos);
      toast.success('✓ Exportado como CSV com sucesso!');
    } catch (err) {
      toast.error('Erro ao exportar CSV');
    }
  };

  const handleExportarJSON = () => {
    try {
      exportarJSON(produtos);
      toast.success('✓ Exportado como JSON com sucesso!');
    } catch (err) {
      toast.error('Erro ao exportar JSON');
    }
  };

  const handleExportarHTML = () => {
    try {
      exportarHTML(produtos);
      toast.success('✓ Relatório HTML gerado com sucesso!');
    } catch (err) {
      toast.error('Erro ao exportar HTML');
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 text-card-foreground">
      <div className="flex items-center gap-3 mb-4">
        <Download className="w-5 h-5 text-[var(--highlight)]" />
        <h3 className="text-lg font-semibold text-card-foreground">Exportar Dados</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Button
          onClick={handleExportarCSV}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Exportar CSV
        </Button>

        <Button
          onClick={handleExportarJSON}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white flex items-center gap-2"
        >
          <FileJson className="w-4 h-4" />
          Exportar JSON
        </Button>

        <Button
          onClick={handleExportarHTML}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Relatório HTML
        </Button>
      </div>

      <p className="text-muted-foreground text-sm mt-4">
        💡 Dica: Exporte seus dados regularmente para backup e análise externa
      </p>
    </div>
  );
}
