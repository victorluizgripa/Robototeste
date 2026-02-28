"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { CreateSummaryForm } from "./novo/create-summary-form";

type Subject = { id: string; name: string };
type Theme = { id: string; name: string; subject_id: string };

type Props = {
  subjects: Subject[];
  themes: Theme[];
  trigger?: React.ReactNode;
};

export function CreateSummaryModal({ subjects, themes, trigger }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSuccess = useCallback(
    (userSummaryId: string) => {
      setOpen(false);
      router.push(`/resumos/${userSummaryId}`);
    },
    [router],
  );

  return (
    <>
      {trigger ? (
        <span onClick={() => setOpen(true)} className="cursor-pointer">
          {trigger}
        </span>
      ) : (
        <Button onClick={() => setOpen(true)}>Criar Resumo</Button>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} title="Criar Resumo">
        <div className="p-5 pt-4">
          <p className="mb-5 text-sm text-txt-2">
            Escolha um tema e o nível. A gente monta um resumo enxuto pra você
            revisar e acertar mais.
          </p>
          <CreateSummaryForm
            subjects={subjects}
            themes={themes}
            onSuccess={handleSuccess}
          />
        </div>
      </Dialog>
    </>
  );
}
