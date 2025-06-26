import { DocumentDocument as Document } from "../../../shared-types/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { format } from "date-fns";
import {
  Calendar,
  FileText,
  Tag,
  FileType,
  ExternalLink,
  X,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

interface DocumentPreviewModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentPreviewModal({
  document,
  isOpen,
  onClose,
}: DocumentPreviewModalProps) {
  const [preview, setPreview] = useState<{ src: string; type: "image" | "pdf" } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && document) {
      setIsLoading(true);
      setTimeout(() => {
        setPreview({
          src: `https://via.placeholder.com/800x1100.png/E2E8F0/4A5568?text=${encodeURIComponent(
            document.title
          )}`,
          type: "image",
        });
        setIsLoading(false);
      }, 1000);
    } else {
      setPreview(null);
    }
  }, [isOpen, document]);

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  if (!document) {
    return null;
  }

  
  const getStatusBadgeClass = (status: string) => {
    if (status === "expired") {
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    } else if (status === "warning") {
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
    } else {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    }
  };


  const getStatusText = (status: string) => {
    if (status === "expired") {
      return "Scaduto";
    } else if (status === "warning") {
      return "In Scadenza";
    } else {
      return "Valido";
    }
  };

 
  const getStatusIcon = (status: string) => {
    if (status === "expired") {
      return <AlertCircle className="h-3 w-3 mr-1" />;
    } else if (status === "warning") {
      return <AlertTriangle className="h-3 w-3 mr-1" />;
    } else {
      return <CheckCircle className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-md lg:max-w-md xl:max-w-md px-2 xs:px-4 py-4 sm:rounded-lg max-h-[80vh] overflow-y-auto"
        aria-describedby="document-preview-description"
      >
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-base xs:text-lg sm:text-xl pr-8 truncate">
            {document.title} - {document.revision}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          <div id="document-preview-description" className="sr-only">
            Anteprima e dettagli del documento {document.title}
          </div>
          <div className="bg-slate-100 dark:bg-slate-700 p-3 xs:p-4 rounded-md">
            {/* File Preview Placeholder */}
            <div className="flex items-center justify-center h-32 xs:h-40 sm:h-48 md:h-56 w-full">
              <div className="text-center">
                <FileText className="h-12 w-12 xs:h-14 xs:w-14 sm:h-16 sm:w-16 mx-auto text-slate-400 dark:text-slate-500" />
                <p className="mt-2 text-xs xs:text-sm text-slate-500 dark:text-slate-400">
                  Anteprima non disponibile
                </p>
                <Button
                  className="mt-3 xs:mt-4 h-8 text-xs xs:text-sm px-3"
                  asChild
                >
                  <a
                    href={document.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-3 w-3 xs:h-4 xs:w-4" />
                    Apri in Google Drive
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <ScrollArea className="h-[150px] xs:h-[170px] sm:h-[200px] mt-3 xs:mt-4">
            <div className="space-y-3 xs:space-y-4">
              <div>
                <h4 className="text-xs xs:text-sm font-medium text-slate-700 dark:text-slate-300">
                  Dettagli Documento
                </h4>
                <div className="mt-2 grid grid-cols-2 gap-x-3 xs:gap-x-4 gap-y-1 xs:gap-y-2 text-xs xs:text-sm">
                  <div className="flex items-center text-slate-500 dark:text-slate-400">
                    <Tag className="h-3 w-3 xs:h-4 xs:w-4 mr-1 xs:mr-2" />
                    Riferimento:
                  </div>
                  <div className="font-medium text-slate-900 dark:text-white truncate">
                    {document.path}
                  </div>

                  <div className="flex items-center text-slate-500 dark:text-slate-400">
                    <FileType className="h-3 w-3 xs:h-4 xs:w-4 mr-1 xs:mr-2" />
                    Revisione:
                  </div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    {document.revision}
                  </div>

                  <div className="flex items-center text-slate-500 dark:text-slate-400">
                    <Calendar className="h-3 w-3 xs:h-4 xs:w-4 mr-1 xs:mr-2" />
                    Aggiornato:
                  </div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    {document.updatedAt
                      ? format(
                          new Date(document.updatedAt as unknown as string),
                          "yyyy-MM-dd"
                        )
                      : "N/A"}
                  </div>

                  <div className="flex items-center text-slate-500 dark:text-slate-400">
                    Stato:
                  </div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    <span
                      className={`inline-flex items-center px-1.5 xs:px-2 py-0.5 rounded text-[10px] xs:text-xs font-medium ${getStatusBadgeClass(
                        document.alertStatus || "valid"
                      )}`}
                    >
                      {getStatusIcon(document.alertStatus || "valid")}
                      {getStatusText(document.alertStatus || "valid")}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs xs:text-sm font-medium text-slate-700 dark:text-slate-300">
                  Documenti Correlati
                </h4>
                <ul className="mt-1 xs:mt-2 divide-y divide-slate-200 dark:divide-slate-700">
                  <li className="py-1 xs:py-2">
                    <p className="text-xs xs:text-sm text-slate-500 dark:text-slate-400">
                      Nessun documento correlato disponibile.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="h-8 text-xs xs:text-sm"
            onClick={handleClose}
          >
            Chiudi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
