"use client";

import { useEffect, useState } from "react";

import { ArrowLeft, Check, ChevronDown, Loader2, MoreHorizontal, Plus, Search, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { configStorage, credentialsStorage } from "@/lib/storage";
import { cn } from "@/lib/utils";

export function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-8 py-4">
      <div className="min-w-0 flex-1 space-y-0.5">
        <Label className="font-medium text-sm">{title}</Label>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function GeneralSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 font-semibold text-lg">Geral</h2>
        <div className="rounded-lg border bg-card">
          <div className="px-4">
            <SettingRow
              title="Nome de exibição"
              description="Nome personalizado exibido na interface (padrão: nome do sistema)"
            >
              <Input className="w-44" placeholder="user" />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Shell do terminal"
              description="Shell padrão para terminal e ferramentas bash. Detectado automaticamente por padrão."
            >
              <Select defaultValue="auto">
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Automático (padrão)</SelectItem>
                  <SelectItem value="bash">Bash</SelectItem>
                  <SelectItem value="zsh">Zsh</SelectItem>
                  <SelectItem value="fish">Fish</SelectItem>
                  <SelectItem value="powershell">PowerShell</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow title="Nível de log" description="Controla a quantidade de informações de log registradas">
              <Select defaultValue="info">
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debug">DEBUG</SelectItem>
                  <SelectItem value="info">INFO (padrão)</SelectItem>
                  <SelectItem value="warn">WARN</SelectItem>
                  <SelectItem value="error">ERROR</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-lg">Aparência</h2>
        <div className="rounded-lg border bg-card">
          <div className="px-4">
            <SettingRow
              title="Esquema de cores"
              description="Escolha se o OpenCode segue o tema do sistema, claro ou escuro"
            >
              <Select defaultValue="system">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">Sistema</SelectItem>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow title="Tema" description="Tema visual da interface do TUI">
              <Select defaultValue="default">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="supabase">Supabase</SelectItem>
                  <SelectItem value="vercel">Vercel</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow title="Captura do mouse" description="Habilitar ou desabilitar a captura do mouse no TUI">
              <Switch defaultChecked />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Estilo do diff"
              description="Estilo de renderização do diff. 'Auto' se adapta à largura do terminal."
            >
              <Select defaultValue="auto">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (padrão)</SelectItem>
                  <SelectItem value="stacked">Empilhado</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow title="Estilo do cursor" description="Formato do cursor no TUI">
              <Select defaultValue="block">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="block">Bloco</SelectItem>
                  <SelectItem value="underline">Sublinhado</SelectItem>
                  <SelectItem value="line">Linha</SelectItem>
                  <SelectItem value="default">Padrão do terminal</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow title="Piscar cursor" description="Se o cursor deve piscar no TUI">
              <Switch defaultChecked />
            </SettingRow>
            <Separator />
            <SettingRow title="Velocidade de rolagem" description="Velocidade de rolagem do TUI (mínimo: 0.001)">
              <Input className="w-24" type="number" defaultValue="1" min="0.001" step="0.1" />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Aceleração de rolagem"
              description="Habilitar aceleração de rolagem ao girar a roda do mouse"
            >
              <Switch defaultChecked />
            </SettingRow>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-lg">Notificações</h2>
        <div className="rounded-lg border bg-card">
          <div className="px-4">
            <SettingRow title="Habilitar notificações" description="Ativar notificações desktop e sons do TUI">
              <Switch />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Notificações desktop"
              description="Mostrar notificações do sistema quando o agente concluir ou precisar de atenção"
            >
              <Switch defaultChecked />
            </SettingRow>
            <Separator />
            <SettingRow title="Sons" description="Reproduzir sons de notificação">
              <Switch defaultChecked />
            </SettingRow>
            <Separator />
            <SettingRow title="Volume" description="Volume dos sons de notificação (0-1)">
              <Input className="w-24" type="number" defaultValue="0.4" min="0" max="1" step="0.1" />
            </SettingRow>
            <Separator />
            <SettingRow title="Pacote de sons" description="Pacote de sons usado para notificações">
              <Select defaultValue="opencode.default">
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="opencode.default">OpenCode Padrão</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-lg">Compartilhamento & Atualizações</h2>
        <div className="rounded-lg border bg-card">
          <div className="px-4">
            <SettingRow title="Compartilhamento" description="Controla como sessões são compartilhadas">
              <Select defaultValue="manual">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual (padrão)</SelectItem>
                  <SelectItem value="auto">Automático</SelectItem>
                  <SelectItem value="disabled">Desabilitado</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow
              title="Atualização automática"
              description="Comportamento de atualização automática do OpenCode"
            >
              <Select defaultValue="true">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Habilitado (padrão)</SelectItem>
                  <SelectItem value="false">Desabilitado</SelectItem>
                  <SelectItem value="notify">Apenas notificar</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow title="Snapshot" description="Habilitar rastreamento de snapshot para restauração de sessões">
              <Switch defaultChecked />
            </SettingRow>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-lg">Compactação</h2>
        <div className="rounded-lg border bg-card">
          <div className="px-4">
            <SettingRow
              title="Compactação automática"
              description="Compactar automaticamente quando o contexto estiver cheio"
            >
              <Switch defaultChecked />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Podar saídas de ferramentas"
              description="Habilitar poda de saídas de ferramentas antigas para economizar contexto"
            >
              <Switch />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Turnos recentes preservados"
              description="Número de turnos recentes a manter sem compactação"
            >
              <Input className="w-24" type="number" defaultValue="2" min="0" />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Tokens recentes preservados"
              description="Número máximo de tokens dos turnos recentes a preservar"
            >
              <Input className="w-24" type="number" placeholder="auto" />
            </SettingRow>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-lg">Imagens</h2>
        <div className="rounded-lg border bg-card">
          <div className="px-4">
            <SettingRow
              title="Redimensionar automaticamente"
              description="Redimensionar imagens que excedem os limites de tamanho"
            >
              <Switch defaultChecked />
            </SettingRow>
            <Separator />
            <SettingRow title="Largura máxima" description="Largura máxima de imagens em pixels">
              <Input className="w-24" type="number" defaultValue="2000" min="100" />
            </SettingRow>
            <Separator />
            <SettingRow title="Altura máxima" description="Altura máxima de imagens em pixels">
              <Input className="w-24" type="number" defaultValue="2000" min="100" />
            </SettingRow>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-lg">Saída de Ferramentas</h2>
        <div className="rounded-lg border bg-card">
          <div className="px-4">
            <SettingRow
              title="Máximo de linhas"
              description="Número máximo de linhas antes de truncar a saída da ferramenta"
            >
              <Input className="w-24" type="number" defaultValue="2000" min="100" />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Máximo de bytes"
              description="Número máximo de bytes antes de truncar a saída da ferramenta"
            >
              <Input className="w-24" type="number" defaultValue="51200" min="1024" />
            </SettingRow>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-lg">Prompt</h2>
        <div className="rounded-lg border bg-card">
          <div className="px-4">
            <SettingRow title="Altura máxima do prompt" description="Altura máxima da textarea de prompt em pixels">
              <Input className="w-24" type="number" placeholder="auto" min="100" />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Largura máxima do prompt"
              description="Largura máxima do prompt na tela inicial. 'auto' escala com a interface."
            >
              <Select defaultValue="auto">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Automático</SelectItem>
                  <SelectItem value="600">600px</SelectItem>
                  <SelectItem value="800">800px</SelectItem>
                  <SelectItem value="1000">1000px</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-lg">Avançado</h2>
        <div className="rounded-lg border bg-card">
          <div className="px-4">
            <SettingRow
              title="Timeout da leader key"
              description="Tempo de espera em milissegundos para completar atalhos com leader key (Ctrl+X)"
            >
              <Input className="w-24" type="number" defaultValue="2000" min="500" step="100" />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Ferramenta batch"
              description="Habilitar a ferramenta batch para executar múltiplas operações"
            >
              <Switch />
            </SettingRow>
            <Separator />
            <SettingRow title="OpenTelemetry" description="Habilitar spans OpenTelemetry para chamadas de IA">
              <Switch />
            </SettingRow>
            <Separator />
            <SettingRow
              title="Continuar ao negar"
              description="Continuar loop do agente quando uma chamada de ferramenta for negada"
            >
              <Switch />
            </SettingRow>
          </div>
        </div>
      </div>
    </div>
  );
}

const shortcutsData = {
  Aplicação: [
    { description: "Sair da aplicação", keybinding: "Ctrl+C / Ctrl+D / Ctrl+X Q" },
    { description: "Alternar painel de depuração", keybinding: "Não atribuído" },
    { description: "Alternar console", keybinding: "Não atribuído" },
    { description: "Escrever snapshot de heap", keybinding: "Não atribuído" },
    { description: "Alternar animações", keybinding: "Não atribuído" },
    { description: "Alternar contexto de arquivo", keybinding: "Não atribuído" },
    { description: "Alternar quebra de diff", keybinding: "Não atribuído" },
    { description: "Alternar resumo de cola", keybinding: "Não atribuído" },
    { description: "Alternar filtragem de diretório de sessão", keybinding: "Não atribuído" },
  ],
  "Paleta de Comandos & Navegação": [
    { description: "Listar comandos disponíveis", keybinding: "Ctrl+P" },
    { description: "Abrir diálogo de ajuda", keybinding: "Não atribuído" },
    { description: "Abrir documentação", keybinding: "Não atribuído" },
    { description: "Alternar painel which-key", keybinding: "Ctrl+Alt+K" },
    { description: "Alternar layout which-key", keybinding: "Ctrl+Alt+Shift+K" },
    { description: "Alternar visualização pendente which-key", keybinding: "Ctrl+Alt+Shift+P" },
    { description: "Grupo which-key anterior", keybinding: "Ctrl+Alt+Left / Ctrl+Alt+[" },
    { description: "Próximo grupo which-key", keybinding: "Ctrl+Alt+Right / Ctrl+Alt+]" },
    { description: "Rolar which-key para cima", keybinding: "Ctrl+Alt+Up / Ctrl+Alt+P" },
    { description: "Rolar which-key para baixo", keybinding: "Ctrl+Alt+Down / Ctrl+Alt+N" },
    { description: "Página which-key para cima", keybinding: "Ctrl+Alt+PageUp" },
    { description: "Página which-key para baixo", keybinding: "Ctrl+Alt+PageDown" },
    { description: "Ir para primeiro atalho which-key", keybinding: "Ctrl+Alt+Home" },
    { description: "Ir para último atalho which-key", keybinding: "Ctrl+Alt+End" },
  ],
  "Visualizador de Diff": [
    { description: "Abrir visualizador de diff", keybinding: "Não atribuído" },
    { description: "Fechar visualizador de diff", keybinding: "Escape / Q" },
    { description: "Alternar item do diff", keybinding: "Enter / Espaço" },
    { description: "Expandir item do diff", keybinding: "→" },
    { description: "Expandir todas as pastas do diff", keybinding: "E" },
    { description: "Recolher item do diff", keybinding: "←" },
    { description: "Alternar foco do diff", keybinding: "Tab" },
    { description: "Próximo bloco de diff", keybinding: "]" },
    { description: "Bloco de diff anterior", keybinding: "[" },
    { description: "Próximo arquivo de diff", keybinding: "N" },
    { description: "Arquivo de diff anterior", keybinding: "P" },
    { description: "Alternar árvore de arquivos do diff", keybinding: "B" },
    { description: "Alternar visualização de patch único", keybinding: "S" },
    { description: "Alternar fonte do diff", keybinding: "D" },
    { description: "Alternar diff split/unificado", keybinding: "V" },
    { description: "Mostrar mais atalhos do diff", keybinding: "?" },
  ],
  "Editor & Temas": [
    { description: "Abrir editor externo", keybinding: "Ctrl+X E" },
    { description: "Listar temas disponíveis", keybinding: "Ctrl+X T" },
    { description: "Alternar modo claro/escuro", keybinding: "Não atribuído" },
    { description: "Bloquear/desbloquear modo de tema", keybinding: "Não atribuído" },
  ],
  "Barra Lateral & Status": [
    { description: "Alternar barra lateral", keybinding: "Ctrl+X B" },
    { description: "Alternar barra de rolagem da sessão", keybinding: "Não atribuído" },
    { description: "Ver status", keybinding: "Ctrl+X S" },
    { description: "Ver informações de depuração", keybinding: "Não atribuído" },
  ],
  Sessões: [
    { description: "Exportar sessão no editor", keybinding: "Ctrl+X X" },
    { description: "Copiar transcrição da sessão", keybinding: "Não atribuído" },
    { description: "Mover sessão", keybinding: "Não atribuído" },
    { description: "Criar nova sessão", keybinding: "Ctrl+X N" },
    { description: "Listar todas as sessões", keybinding: "Ctrl+X L" },
    { description: "Linha do tempo da sessão", keybinding: "Ctrl+X G" },
    { description: "Bifurcar sessão a partir de mensagem", keybinding: "Não atribuído" },
    { description: "Renomear sessão", keybinding: "Ctrl+R" },
    { description: "Excluir sessão", keybinding: "Ctrl+D" },
    { description: "Compartilhar sessão atual", keybinding: "Não atribuído" },
    { description: "Descompartilhar sessão atual", keybinding: "Não atribuído" },
    { description: "Interromper sessão atual", keybinding: "Escape" },
    { description: "Subagentes em segundo plano", keybinding: "Ctrl+B" },
    { description: "Compactar sessão", keybinding: "Ctrl+X C" },
    { description: "Alternar carimbos de data/hora das mensagens", keybinding: "Não atribuído" },
    { description: "Alternar saída de ferramenta genérica", keybinding: "Não atribuído" },
    { description: "Gerenciar prompts na fila", keybinding: "Ctrl+X Q" },
    { description: "Ir para primeira sessão filha", keybinding: "Ctrl+X ↓" },
    { description: "Próxima sessão filha", keybinding: "→" },
    { description: "Sessão filha anterior", keybinding: "←" },
    { description: "Sessão pai", keybinding: "↑" },
    { description: "Fixar/desfixar sessão na lista", keybinding: "Ctrl+F" },
  ],
  "Troca Rápida de Sessão": [
    { description: "Ir para sessão no slot 1", keybinding: "Ctrl+X 1" },
    { description: "Ir para sessão no slot 2", keybinding: "Ctrl+X 2" },
    { description: "Ir para sessão no slot 3", keybinding: "Ctrl+X 3" },
    { description: "Ir para sessão no slot 4", keybinding: "Ctrl+X 4" },
    { description: "Ir para sessão no slot 5", keybinding: "Ctrl+X 5" },
    { description: "Ir para sessão no slot 6", keybinding: "Ctrl+X 6" },
    { description: "Ir para sessão no slot 7", keybinding: "Ctrl+X 7" },
    { description: "Ir para sessão no slot 8", keybinding: "Ctrl+X 8" },
    { description: "Ir para sessão no slot 9", keybinding: "Ctrl+X 9" },
  ],
  "Modelo & Provedor": [
    { description: "Abrir lista de provedores", keybinding: "Ctrl+A" },
    { description: "Alternar favorito do modelo", keybinding: "Ctrl+F" },
    { description: "Listar modelos disponíveis", keybinding: "Ctrl+X M" },
    { description: "Próximo modelo usado recentemente", keybinding: "F2" },
    { description: "Modelo usado recentemente anterior", keybinding: "Shift+F2" },
    { description: "Próximo modelo favorito", keybinding: "Não atribuído" },
    { description: "Modelo favorito anterior", keybinding: "Não atribuído" },
  ],
  "MCP & Plugins": [
    { description: "Listar servidores MCP", keybinding: "Não atribuído" },
    { description: "Conectar provedor", keybinding: "Não atribuído" },
    { description: "Alternar organização do console", keybinding: "Não atribuído" },
    { description: "Alternar plugin", keybinding: "Espaço" },
    { description: "Instalar plugin do diálogo", keybinding: "Shift+I" },
    { description: "Abrir diálogo de gerenciamento de plugins", keybinding: "Não atribuído" },
    { description: "Instalar plugin", keybinding: "Não atribuído" },
  ],
  "Agentes & Variantes": [
    { description: "Listar agentes", keybinding: "Ctrl+X A" },
    { description: "Próximo agente", keybinding: "Tab" },
    { description: "Agente anterior", keybinding: "Shift+Tab" },
    { description: "Ciclar variantes de modelo", keybinding: "Ctrl+T" },
    { description: "Listar variantes de modelo", keybinding: "Não atribuído" },
  ],
  "Rolagem de Mensagens": [
    { description: "Rolar mensagens para cima (página)", keybinding: "PageUp / Ctrl+Alt+B" },
    { description: "Rolar mensagens para baixo (página)", keybinding: "PageDown / Ctrl+Alt+F" },
    { description: "Rolar mensagens para cima (linha)", keybinding: "Ctrl+Alt+Y" },
    { description: "Rolar mensagens para baixo (linha)", keybinding: "Ctrl+Alt+E" },
    { description: "Rolar mensagens para cima (meia página)", keybinding: "Ctrl+Alt+U" },
    { description: "Rolar mensagens para baixo (meia página)", keybinding: "Ctrl+Alt+D" },
    { description: "Ir para primeira mensagem", keybinding: "Ctrl+G / Home" },
    { description: "Ir para última mensagem", keybinding: "Ctrl+Alt+G / End" },
    { description: "Próxima mensagem", keybinding: "Não atribuído" },
    { description: "Mensagem anterior", keybinding: "Não atribuído" },
    { description: "Ir para última mensagem do usuário", keybinding: "Não atribuído" },
  ],
  "Ações de Mensagem": [
    { description: "Copiar mensagem", keybinding: "Ctrl+X Y" },
    { description: "Desfazer mensagem", keybinding: "Ctrl+X U" },
    { description: "Refazer mensagem", keybinding: "Ctrl+X R" },
    { description: "Alternar ocultação de bloco de código", keybinding: "Ctrl+X H" },
    { description: "Alternar visibilidade de detalhes da ferramenta", keybinding: "Não atribuído" },
    { description: "Alternar visibilidade de blocos de pensamento", keybinding: "Não atribuído" },
  ],
  Prompt: [
    { description: "Enviar prompt", keybinding: "Não atribuído" },
    { description: "Limpar contexto do editor", keybinding: "Não atribuído" },
    { description: "Abrir seletor de habilidade", keybinding: "Não atribuído" },
    { description: "Guardar prompt", keybinding: "Não atribuído" },
    { description: "Recuperar prompt guardado", keybinding: "Não atribuído" },
    { description: "Listar prompts guardados", keybinding: "Não atribuído" },
    { description: "Definir espaço de trabalho", keybinding: "Não atribuído" },
  ],
  "Edição de Input": [
    { description: "Limpar campo de input", keybinding: "Ctrl+C" },
    { description: "Colar da área de transferência", keybinding: "Ctrl+V" },
    { description: "Enviar input", keybinding: "Enter" },
    { description: "Inserir nova linha no input", keybinding: "Shift+Enter / Ctrl+Enter / Alt+Enter / Ctrl+J" },
    { description: "Mover cursor para esquerda", keybinding: "← / Ctrl+B" },
    { description: "Mover cursor para direita", keybinding: "→ / Ctrl+F" },
    { description: "Mover cursor para cima", keybinding: "↑" },
    { description: "Mover cursor para baixo", keybinding: "↓" },
    { description: "Selecionar para esquerda", keybinding: "Shift+←" },
    { description: "Selecionar para direita", keybinding: "Shift+→" },
    { description: "Selecionar para cima", keybinding: "Shift+↑" },
    { description: "Selecionar para baixo", keybinding: "Shift+↓" },
    { description: "Ir para início da linha", keybinding: "Ctrl+A" },
    { description: "Ir para fim da linha", keybinding: "Ctrl+E" },
    { description: "Selecionar até o início da linha", keybinding: "Ctrl+Shift+A" },
    { description: "Selecionar até o fim da linha", keybinding: "Ctrl+Shift+E" },
    { description: "Ir para início da linha visual", keybinding: "Alt+A" },
    { description: "Ir para fim da linha visual", keybinding: "Alt+E" },
    { description: "Selecionar até o início da linha visual", keybinding: "Alt+Shift+A" },
    { description: "Selecionar até o fim da linha visual", keybinding: "Alt+Shift+E" },
    { description: "Ir para início do buffer", keybinding: "Home" },
    { description: "Ir para fim do buffer", keybinding: "End" },
    { description: "Selecionar até o início do buffer", keybinding: "Shift+Home" },
    { description: "Selecionar até o fim do buffer", keybinding: "Shift+End" },
    { description: "Excluir linha no input", keybinding: "Ctrl+Shift+D" },
    { description: "Excluir até o fim da linha", keybinding: "Ctrl+K" },
    { description: "Excluir até o início da linha", keybinding: "Ctrl+U" },
    { description: "Backspace no input", keybinding: "Backspace / Shift+Backspace" },
    { description: "Excluir caractere no input", keybinding: "Ctrl+D / Delete / Shift+Delete" },
    { description: "Desfazer no input", keybinding: "Ctrl+- / Super+Z" },
    { description: "Refazer no input", keybinding: "Ctrl+. / Super+Shift+Z" },
    { description: "Mover palavra para frente", keybinding: "Alt+F / Alt+→ / Ctrl+→" },
    { description: "Mover palavra para trás", keybinding: "Alt+B / Alt+← / Ctrl+←" },
    { description: "Selecionar palavra para frente", keybinding: "Alt+Shift+F / Alt+Shift+→" },
    { description: "Selecionar palavra para trás", keybinding: "Alt+Shift+B / Alt+Shift+←" },
    { description: "Excluir palavra para frente", keybinding: "Alt+D / Alt+Delete / Ctrl+Delete" },
    { description: "Excluir palavra para trás", keybinding: "Ctrl+W / Ctrl+Backspace / Alt+Backspace" },
    { description: "Selecionar tudo no input", keybinding: "Super+A" },
    { description: "Item de histórico anterior", keybinding: "↑" },
    { description: "Próximo item de histórico", keybinding: "↓" },
  ],
  "Navegação em Diálogo": [
    { description: "Item de diálogo anterior", keybinding: "↑ / Ctrl+P" },
    { description: "Próximo item de diálogo", keybinding: "↓ / Ctrl+N" },
    { description: "Página para cima no diálogo", keybinding: "PageUp" },
    { description: "Página para baixo no diálogo", keybinding: "PageDown" },
    { description: "Primeiro item do diálogo", keybinding: "Home" },
    { description: "Último item do diálogo", keybinding: "End" },
    { description: "Enviar item selecionado", keybinding: "Enter" },
    { description: "Enviar prompt do diálogo", keybinding: "Enter" },
    { description: "Alternar MCP no diálogo MCP", keybinding: "Espaço" },
    { description: "Nova cópia do projeto (mover sessão)", keybinding: "Ctrl+M" },
    { description: "Excluir cópia do projeto (mover sessão)", keybinding: "Ctrl+D" },
    { description: "Atualizar cópias do projeto (mover sessão)", keybinding: "Ctrl+R" },
  ],
  Autocomplete: [
    { description: "Item anterior do autocomplete", keybinding: "↑ / Ctrl+P" },
    { description: "Próximo item do autocomplete", keybinding: "↓ / Ctrl+N" },
    { description: "Ocultar autocomplete", keybinding: "Escape" },
    { description: "Selecionar item do autocomplete", keybinding: "Enter" },
    { description: "Completar item do autocomplete", keybinding: "Tab" },
  ],
  "Prompt de Permissão": [{ description: "Alternar tela cheia do prompt de permissão", keybinding: "Ctrl+F" }],
  "Terminal & Diversos": [
    { description: "Suspender terminal", keybinding: "Ctrl+Z" },
    { description: "Alternar título do terminal", keybinding: "Não atribuído" },
    { description: "Alternar dicas na tela inicial", keybinding: "Ctrl+X H" },
  ],
};

export function ShortcutsSettings() {
  const [search, setSearch] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(Object.keys(shortcutsData)));

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const filteredData = Object.entries(shortcutsData).reduce(
    (acc, [section, shortcuts]) => {
      const filtered = shortcuts.filter(
        (s) =>
          s.description.toLowerCase().includes(search.toLowerCase()) ||
          s.keybinding.toLowerCase().includes(search.toLowerCase()),
      );
      if (filtered.length > 0) {
        acc[section] = filtered;
      }
      return acc;
    },
    {} as Record<string, Array<{ description: string; keybinding: string }>>,
  );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold text-lg">Atalhos</h2>
      <Input placeholder="Pesquisar atalhos" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="flex flex-col gap-4 overflow-auto pr-1">
        {Object.keys(filteredData).length === 0 ? (
          <p className="py-8 text-center text-muted-foreground text-sm">Nenhum atalho encontrado</p>
        ) : (
          Object.entries(filteredData).map(([section, shortcuts]) => (
            <div key={section}>
              <button
                type="button"
                className="flex w-full items-center gap-1 py-1 text-muted-foreground text-xs uppercase tracking-wide hover:text-foreground"
                onClick={() => toggleSection(section)}
              >
                <ChevronDown
                  className={cn("size-3 transition-transform", !expandedSections.has(section) && "-rotate-90")}
                />
                {section}
              </button>
              {expandedSections.has(section) && (
                <div className="mt-1 divide-y divide-border rounded-lg border">
                  {shortcuts.map((shortcut) => (
                    <div
                      key={shortcut.description}
                      className="flex items-center justify-between bg-card px-3 py-2 text-sm"
                    >
                      <span className="text-muted-foreground">{shortcut.description}</span>
                      <kbd className="font-mono text-xs">{shortcut.keybinding}</kbd>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function ServersSettings() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-lg">Servidores</h2>
        <Button variant="ghost" size="sm">
          <Plus className="mr-1 size-4" />
          Adicionar servidor
        </Button>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-green-500" />
            <div>
              <p className="font-medium text-sm">8081-cs-88875918477-default.cs-us-east1-pkhd.cloudshell.dev</p>
              <p className="text-muted-foreground text-xs">sem nome de usuário</p>
            </div>
          </div>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

async function getConnectedProviders(): Promise<Record<string, string>> {
  if (typeof window === "undefined") return {};
  const keys = await credentialsStorage.list();
  const result: Record<string, string> = {};
  for (const key of keys) {
    const value = await credentialsStorage.get(key);
    if (value) result[key] = value;
  }
  return result;
}

async function saveConnectedProvider(providerId: string, apiKey: string): Promise<void> {
  await credentialsStorage.set(providerId, apiKey);
}

async function removeConnectedProvider(providerId: string): Promise<void> {
  await credentialsStorage.delete(providerId);
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

function getCached<T>(key: string, ttlMs: number): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > ttlMs) return null;
    return entry.data;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
}

const PROVIDERS_CACHE_KEY = "workspaacing:providers_cache";
const MODELS_CACHE_KEY = "workspaacing:models_cache";
const CACHE_TTL = 3600_000;

type ProviderData = Record<string, { name: string; env?: string[]; npm?: string; api?: string }>;
type LabsData = Record<string, string>;

async function fetchProvidersData(): Promise<{ models: ProviderData; labs: LabsData }> {
  const cached = getCached<{ models: ProviderData; labs: LabsData }>(PROVIDERS_CACHE_KEY, CACHE_TTL);
  if (cached) return cached;

  const [modelsRes, labsRes] = await Promise.all([fetch("/api/models"), fetch("/api/labs")]);
  const models: ProviderData = await modelsRes.json();
  const labs: LabsData = await labsRes.json();

  setCache(PROVIDERS_CACHE_KEY, { models, labs });
  return { models, labs };
}

type ModelsByProvider = Record<string, { name: string; models: Record<string, ModelData> }>;

async function fetchModelsData(providerIds: string[]): Promise<ModelsByProvider> {
  const cacheKey = `${MODELS_CACHE_KEY}:${providerIds.sort().join(",")}`;
  const cached = getCached<ModelsByProvider>(cacheKey, CACHE_TTL);
  if (cached) return cached;

  const params = providerIds.join(",");
  const res = await fetch(`/api/models?provider=${params}`);
  const data: ModelsByProvider = await res.json();

  setCache(cacheKey, data);
  return data;
}

function ProviderInitials({ name, className }: { name: string; className?: string }) {
  return (
    <span className={cn("flex items-center justify-center rounded-md bg-muted font-medium text-xs", className)}>
      {name.slice(0, 2)}
    </span>
  );
}

export function ProvidersSettings() {
  const [connected, setConnected] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [search, setSearch] = useState("");
  const [allProviders, setAllProviders] = useState<
    Array<{ id: string; name: string; npm: string; api?: string; description: string; envKey: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [customId, setCustomId] = useState("");
  const [customName, setCustomName] = useState("");
  const [customBaseUrl, setCustomBaseUrl] = useState("");
  const [customApiKey, setCustomApiKey] = useState("");

  useEffect(() => {
    void getConnectedProviders().then(setConnected);
    fetchProvidersData()
      .then(({ models, labs }) => {
        const providers = Object.entries(models).map(([id, p]) => ({
          id,
          name: p.name,
          npm: p.npm || "@ai-sdk/openai-compatible",
          api: p.api,
          description: labs[id] || "",
          envKey: p.env?.[0] || `${id.toUpperCase()}_API_KEY`,
        }));
        providers.sort((a, b) => {
          const aPopular = a.description ? 0 : 1;
          const bPopular = b.description ? 0 : 1;
          if (aPopular !== bPopular) return aPopular - bPopular;
          return a.name.localeCompare(b.name);
        });
        setAllProviders(providers);
      })
      .catch(() => {
        /* ignore */
      })
      .finally(() => setLoading(false));
  }, []);

  const handleConnect = (provider: { id: string; name: string; npm: string; api?: string; envKey: string }) => {
    setEditingId(provider.id);
    setApiKeyInput(connected[provider.id] || "");
  };

  const handleSave = async (providerId: string) => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) return;
    await saveConnectedProvider(providerId, trimmed);
    const provider = allProviders.find((p) => p.id === providerId);
    if (provider) {
      await configStorage.setProvider(providerId, {
        name: provider.name,
        npm: provider.npm,
        api: provider.api,
      });
    }
    setConnected({ ...connected, [providerId]: trimmed });
    setEditingId(null);
    setApiKeyInput("");
  };

  const handleDisconnect = async (providerId: string) => {
    await removeConnectedProvider(providerId);
    await configStorage.deleteProvider(providerId);
    const next = { ...connected };
    delete next[providerId];
    setConnected(next);
  };

  const handleSaveCustom = async () => {
    const id = customId.trim();
    const name = customName.trim();
    const baseUrl = customBaseUrl.trim();
    const apiKey = customApiKey.trim();
    if (!id || !name || !baseUrl || !apiKey) return;
    await saveConnectedProvider(id, apiKey);
    await configStorage.setCustomProvider(id, {
      name,
      baseUrl,
      npm: "@ai-sdk/openai-compatible",
    });
    setConnected({ ...connected, [id]: apiKey });
    setCustomDialogOpen(false);
    setCustomId("");
    setCustomName("");
    setCustomBaseUrl("");
    setCustomApiKey("");
  };

  const connectedProviders = allProviders.filter((p) => connected[p.id]);
  const popularProviders = allProviders.filter((p) => p.description && !connected[p.id]);
  const availableProviders = allProviders.filter(
    (p) =>
      !connected[p.id] &&
      !p.description &&
      (p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-lg">Provedores</h2>

      <div>
        <h3 className="mb-2 font-medium text-sm">Provedores conectados</h3>
        {connectedProviders.length === 0 ? (
          <div className="rounded-lg border bg-card p-4 text-muted-foreground text-sm">Nenhum provedor conectado</div>
        ) : (
          <div className="rounded-lg border bg-card">
            {connectedProviders.map((provider, index) => (
              <div key={provider.id}>
                {index > 0 && <Separator />}
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ProviderInitials name={provider.name} className="size-8 shrink-0" />
                    <div>
                      <span className="font-medium text-sm">{provider.name}</span>
                      <p className="text-muted-foreground text-xs">
                        Conectado · Chave: {connected[provider.id].slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 text-destructive hover:text-destructive"
                    onClick={() => handleDisconnect(provider.id)}
                  >
                    <X className="mr-1 size-3" />
                    Desconectar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {popularProviders.length > 0 && (
        <div>
          <h3 className="mb-2 font-medium text-sm">Provedores populares</h3>
          <div className="rounded-lg border bg-card">
            {popularProviders.map((provider, index) => (
              <div key={provider.id}>
                {index > 0 && <Separator />}
                {editingId === provider.id ? (
                  <div className="px-4 py-3">
                    <div className="mb-2 flex items-center gap-2">
                      <ProviderInitials name={provider.name} className="size-7 shrink-0" />
                      <span className="font-medium text-sm">{provider.name}</span>
                    </div>
                    <p className="mb-2 text-muted-foreground text-xs">
                      Insira a chave da API oficial ({provider.envKey})
                    </p>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder={provider.envKey}
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSave(provider.id)}
                        className="flex-1"
                        autoFocus
                      />
                      <Button size="sm" onClick={() => handleSave(provider.id)} disabled={!apiKeyInput.trim()}>
                        <Check className="mr-1 size-3" />
                        Salvar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(null);
                          setApiKeyInput("");
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ProviderInitials name={provider.name} className="size-8 shrink-0" />
                      <div>
                        <span className="font-medium text-sm">{provider.name}</span>
                        {provider.description && (
                          <p className="text-muted-foreground text-xs">{provider.description}</p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0" onClick={() => handleConnect(provider)}>
                      <Plus className="mr-1 size-3" />
                      Conectar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-2 font-medium text-sm">Todos os provedores</h3>
        <div className="relative mb-3">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar provedores"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="flex items-center justify-center gap-2 rounded-lg border bg-card py-8 text-muted-foreground text-sm">
            <Loader2 className="size-4 animate-spin" />
            Carregando provedores...
          </div>
        ) : (
          <div className="rounded-lg border bg-card">
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent"
              onClick={() => setCustomDialogOpen(true)}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                <Sparkles className="size-4" />
              </span>
              <div>
                <span className="font-medium text-sm">Provedor personalizado</span>
                <p className="text-muted-foreground text-xs">URL base, chave de API — compatível com OpenAI</p>
              </div>
            </button>
            <Separator />
            {availableProviders.map((provider, index) => (
              <div key={provider.id}>
                {index > 0 && <Separator />}
                {editingId === provider.id ? (
                  <div className="px-4 py-3">
                    <div className="mb-2 flex items-center gap-2">
                      <ProviderInitials name={provider.name} className="size-7 shrink-0" />
                      <span className="font-medium text-sm">{provider.name}</span>
                    </div>
                    <p className="mb-2 text-muted-foreground text-xs">
                      Insira a chave da API oficial ({provider.envKey})
                    </p>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder={provider.envKey}
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSave(provider.id)}
                        className="flex-1"
                        autoFocus
                      />
                      <Button size="sm" onClick={() => handleSave(provider.id)} disabled={!apiKeyInput.trim()}>
                        <Check className="mr-1 size-3" />
                        Salvar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(null);
                          setApiKeyInput("");
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ProviderInitials name={provider.name} className="size-8 shrink-0" />
                      <div>
                        <span className="font-medium text-sm">{provider.name}</span>
                        {provider.description && (
                          <p className="text-muted-foreground text-xs">{provider.description}</p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0" onClick={() => handleConnect(provider)}>
                      <Plus className="mr-1 size-3" />
                      Conectar
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {availableProviders.length === 0 && (
              <p className="px-4 py-6 text-center text-muted-foreground text-sm">
                {allProviders.length === 0 ? "Nenhum provedor encontrado" : "Todos os provedores já estão conectados"}
              </p>
            )}
          </div>
        )}
      </div>

      <Dialog open={customDialogOpen} onOpenChange={setCustomDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md p-1 hover:bg-accent"
                onClick={() => setCustomDialogOpen(false)}
              >
                <ArrowLeft className="size-4" />
              </button>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="size-4" />
                Provedor personalizado
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-muted-foreground text-sm">
              Configure um provedor compatível com OpenAI. Veja a{" "}
              <a
                href="https://opencode.ai/docs/providers/#custom-provider"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-2"
              >
                documentação de configuração do provedor
              </a>
              .
            </p>
            <div className="space-y-2">
              <Label>ID do provedor</Label>
              <Input placeholder="meuproveedor" value={customId} onChange={(e) => setCustomId(e.target.value)} />
              <p className="text-muted-foreground text-xs">Letras minúsculas, números, hifens ou sublinhados</p>
            </div>
            <div className="space-y-2">
              <Label>Nome de exibição</Label>
              <Input
                placeholder="Meu provedor de IA"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>URL base</Label>
              <Input
                placeholder="https://api.meuproveedor.com/v1"
                value={customBaseUrl}
                onChange={(e) => setCustomBaseUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Chave da API</Label>
              <Input
                type="password"
                placeholder="sk-..."
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveCustom()}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleSaveCustom}
              disabled={!customId.trim() || !customName.trim() || !customBaseUrl.trim() || !customApiKey.trim()}
            >
              <Check className="mr-1 size-3" />
              Salvar provedor
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ModelData {
  id: string;
  name: string;
  description?: string;
  cost?: { input?: number; output?: number };
  limit?: { context?: number; output?: number };
  reasoning?: boolean;
  tool_call?: boolean;
  attachment?: boolean;
}

async function getEnabledModels(): Promise<Record<string, boolean>> {
  if (typeof window === "undefined") return {};
  const models = await configStorage.getEnabledModels();
  const result: Record<string, boolean> = {};
  for (const model of models) {
    result[model] = true;
  }
  return result;
}

async function saveEnabledModels(data: Record<string, boolean>): Promise<void> {
  const models = Object.entries(data)
    .filter(([, enabled]) => enabled)
    .map(([id]) => id);
  await configStorage.setEnabledModels(models);
}

function getProviderIcon(name: string): string {
  return name.slice(0, 2);
}

export function ModelsSettings() {
  const [search, setSearch] = useState("");
  const [expandedProviders, setExpandedProviders] = useState<Set<string>>(new Set());
  const [modelsByProvider, setModelsByProvider] = useState<Record<string, { name: string; models: ModelData[] }>>({});
  const [loading, setLoading] = useState(false);
  const [enabledModels, setEnabledModels] = useState<Record<string, boolean>>({});

  useEffect(() => {
    void getEnabledModels().then(setEnabledModels);

    void getConnectedProviders().then((connected) => {
      const providerIds = Object.keys(connected);

      if (providerIds.length === 0) {
        setModelsByProvider({});
        return;
      }

      setLoading(true);
      fetchModelsData(providerIds)
        .then((data) => {
          const result: Record<string, { name: string; models: ModelData[] }> = {};
          for (const [providerId, providerData] of Object.entries(data)) {
            const models = Object.values(providerData.models);
            if (models.length > 0) {
              result[providerId] = { name: providerData.name, models };
            }
          }
          setModelsByProvider(result);
          setExpandedProviders(new Set(Object.keys(result)));
        })
        .catch(() => {
          /* ignore */
        })
        .finally(() => setLoading(false));
    });
  }, []);

  const toggleProvider = (name: string) => {
    setExpandedProviders((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleModel = (modelId: string) => {
    setEnabledModels((prev) => {
      const next = { ...prev, [modelId]: !prev[modelId] };
      void saveEnabledModels(next);
      return next;
    });
  };

  const filteredProviders = Object.entries(modelsByProvider)
    .map(([providerId, provider]) => ({
      providerId,
      name: provider.name,
      icon: getProviderIcon(provider.name),
      models: provider.models.filter(
        (m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((p) => p.models.length > 0);

  const connectedCount = Object.keys(modelsByProvider).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-lg">Modelos</h2>
        <p className="text-muted-foreground text-xs">
          {connectedCount === 0
            ? "Conecte um provedor em Configurações > Provedores para ver seus modelos."
            : `${connectedCount} provedor(es) conectado(s). Modelos carregados de models.dev.`}
        </p>
      </div>

      {connectedCount > 0 && (
        <Input placeholder="Buscar modelos" value={search} onChange={(e) => setSearch(e.target.value)} />
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground text-sm">
          <Loader2 className="size-4 animate-spin" />
          Carregando modelos...
        </div>
      )}

      {!loading && connectedCount === 0 && (
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="mb-1 text-muted-foreground text-sm">Nenhum provedor conectado</p>
          <p className="text-muted-foreground text-xs">
            Vá para Configurações &gt; Provedores e conecte um provedor para ver seus modelos disponíveis.
          </p>
        </div>
      )}

      {!loading && connectedCount > 0 && filteredProviders.length === 0 && (
        <p className="py-8 text-center text-muted-foreground text-sm">Nenhum modelo encontrado</p>
      )}

      <div className="space-y-4">
        {filteredProviders.map((provider) => (
          <div key={provider.providerId}>
            <button
              type="button"
              className="mb-1 flex w-full items-center gap-2 py-1 text-muted-foreground text-xs uppercase tracking-wide hover:text-foreground"
              onClick={() => toggleProvider(provider.providerId)}
            >
              <ChevronDown
                className={cn(
                  "size-3 transition-transform",
                  !expandedProviders.has(provider.providerId) && "-rotate-90",
                )}
              />
              <ProviderInitials name={provider.name} className="size-5 shrink-0" />
              <span className="font-medium">{provider.name}</span>
              <span className="text-muted-foreground">({provider.models.length})</span>
            </button>
            {expandedProviders.has(provider.providerId) && (
              <div className="rounded-lg border bg-card">
                {provider.models.map((model, index) => (
                  <div key={model.id}>
                    {index > 0 && <Separator />}
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <span className="text-sm">{model.name}</span>
                        {model.description && (
                          <p className="truncate text-muted-foreground text-xs">{model.description}</p>
                        )}
                        <div className="mt-0.5 flex flex-wrap gap-2 text-muted-foreground text-xs">
                          {model.reasoning && <span>Raciocínio</span>}
                          {model.tool_call && <span>Tool Call</span>}
                          {model.attachment && <span>Anexos</span>}
                          {model.limit?.context && <span>{Math.round(model.limit.context / 1000)}k contexto</span>}
                          {model.cost?.input !== undefined && model.cost?.output !== undefined && (
                            <span>
                              ${model.cost.input} / ${model.cost.output} por 1M tokens
                            </span>
                          )}
                        </div>
                      </div>
                      <Switch
                        checked={enabledModels[model.id] ?? false}
                        onCheckedChange={() => toggleModel(model.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
