# office-consultoria
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, Upload, Plus, CheckCircle2, Trash2 } from "lucide-react";

// =====================================
// OFFICE • Consultoria Empresarial
// Versão Premium Web
// =====================================

const STORAGE_KEY = "office_enterprise_v2";

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function OFFICEEnterpriseApp() {
  const [tasks, setTasks] = useState(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    return raw ? JSON.parse(raw) : [];
  });

  const [draft, setDraft] = useState({ title: "", description: "" });
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const createTask = () => {
    if (!draft.title.trim()) return;
    const task = {
      id: uid(),
      title: draft.title,
      description: draft.description,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([task, ...tasks]);
    setDraft({ title: "", description: "" });
  };

  const toggleDone = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "OFFICE_backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = async (file) => {
    const text = await file.text();
    const data = JSON.parse(text);
    if (Array.isArray(data)) setTasks(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4B1E78] via-[#5A2490] to-[#3E1763] p-6">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header Premium */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#4B1E78]">
                <span className="text-[#D4A017]">Office</span>
              </h1>
              <p className="text-sm text-gray-600">Consultoria Empresarial • Gestão Estratégica de Tarefas</p>
            </div>

            <div className="flex gap-3 mt-4 md:mt-0">
              <Button variant="outline" className="border-[#D4A017] text-[#D4A017] hover:bg-[#D4A017] hover:text-white" onClick={exportJSON}>
                <Download className="w-4 h-4 mr-2" /> Exportar
              </Button>

              <Button variant="outline" className="border-[#D4A017] text-[#D4A017] hover:bg-[#D4A017] hover:text-white" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" /> Importar
              </Button>
              <input type="file" ref={fileInputRef} className="hidden" accept="application/json" onChange={(e)=>{
                const f = e.target.files?.[0];
                if(f) importJSON(f);
              }} />

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#D4A017] hover:bg-[#b88914] text-white">
                    <Plus className="w-4 h-4 mr-2" /> Nova
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nova Tarefa</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label>Título</Label>
                      <Input value={draft.title} onChange={(e)=>setDraft({...draft,title:e.target.value})} />
                    </div>
                    <div>
                      <Label>Descrição</Label>
                      <Textarea value={draft.description} onChange={(e)=>setDraft({...draft,description:e.target.value})} />
                    </div>
                    <Button className="w-full bg-[#4B1E78] hover:bg-[#3E1763] text-white" onClick={createTask}>
                      Criar Tarefa
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>

        {/* Lista */}
        <Card className="rounded-3xl shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="text-[#4B1E78]">Painel de Tarefas</CardTitle>
            <CardDescription>Controle interno da consultoria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.length === 0 ? (
              <p className="text-center text-gray-500 py-10">Nenhuma tarefa cadastrada.</p>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="flex justify-between items-center border rounded-2xl p-4">
                  <div>
                    <p className={`font-semibold ${task.completed ? "line-through text-gray-400" : ""}`}>{task.title}</p>
                    {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={()=>toggleDone(task.id)}>
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" onClick={()=>deleteTask(task.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <footer className="text-center text-xs text-gray-200 pt-6">
          © {new Date().getFullYear()} Office Consultoria Empresarial
        </footer>

      </div>
    </div>
  );
}
