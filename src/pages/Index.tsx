import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type BlockType = 'text' | 'button' | 'link' | 'image';
type CodeType = 'html' | 'css' | 'js';

interface Block {
  id: string;
  type: BlockType;
  content: string;
  href?: string;
}

export default function Index() {
  const [htmlCode, setHtmlCode] = useState('<!DOCTYPE html>\n<html>\n<head>\n  <title>My Website</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>');
  const [cssCode, setCssCode] = useState('body {\n  font-family: Inter, sans-serif;\n  margin: 0;\n  padding: 20px;\n}');
  const [jsCode, setJsCode] = useState('console.log("PlutStudio ready!");');
  const [selectedCode, setSelectedCode] = useState<CodeType>('html');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [publishedUrl, setPublishedUrl] = useState('');
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const [previewHTML, setPreviewHTML] = useState('');
  const { toast } = useToast();

  const generateBlocksHTML = () => {
    return blocks.map(block => {
      if (block.type === 'text') {
        return `<p>${block.content}</p>`;
      }
      if (block.type === 'button') {
        return `<button style="padding: 8px 24px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer;">${block.content}</button>`;
      }
      if (block.type === 'link') {
        return `<a href="${block.href || '#'}" style="color: #6366f1; text-decoration: underline;">${block.content}</a>`;
      }
      if (block.type === 'image') {
        return `<img src="${block.content}" alt="Image" style="max-width: 100%; border-radius: 8px;" />`;
      }
      return '';
    }).join('\n');
  };

  const updateHTMLWithBlocks = () => {
    const blocksHTML = generateBlocksHTML();
    const bodyMatch = htmlCode.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    
    if (bodyMatch) {
      const newHTML = htmlCode.replace(
        /<body[^>]*>[\s\S]*?<\/body>/i,
        `<body>\n${blocksHTML}\n</body>`
      );
      setHtmlCode(newHTML);
    } else {
      const basicHTML = `<!DOCTYPE html>
<html>
<head>
  <title>PlutStudio Project</title>
</head>
<body>
${blocksHTML}
</body>
</html>`;
      setHtmlCode(basicHTML);
    }
    toast({ title: 'HTML обновлён', description: 'Блоки добавлены в код' });
  };

  const getFullHTML = () => {
    let html = htmlCode;
    
    if (!html.toLowerCase().includes('<style>') && cssCode.trim()) {
      html = html.replace('</head>', `<style>\n${cssCode}\n</style>\n</head>`);
    }
    
    if (!html.toLowerCase().includes('<script>') && jsCode.trim()) {
      html = html.replace('</body>', `<script>\n${jsCode}\n</script>\n</body>`);
    }
    
    return html;
  };

  const refreshPreview = () => {
    setPreviewHTML(getFullHTML());
    toast({ title: 'Превью обновлено' });
  };

  useEffect(() => {
    setPreviewHTML(getFullHTML());
  }, [htmlCode, cssCode, jsCode]);

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? 'Новый текст' : type === 'button' ? 'Кнопка' : type === 'link' ? 'Ссылка' : 'https://via.placeholder.com/300',
      href: type === 'link' ? '#' : undefined
    };
    setBlocks([...blocks, newBlock]);
    toast({ title: 'Блок добавлен', description: `${type} успешно добавлен` });
  };

  const updateBlock = (id: string, content: string, href?: string) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content, href } : block
    ));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
    toast({ title: 'Блок удалён' });
  };

  const handleDragStart = (id: string) => {
    setDraggedBlock(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedBlock && draggedBlock !== id) {
      const draggedIndex = blocks.findIndex(b => b.id === draggedBlock);
      const targetIndex = blocks.findIndex(b => b.id === id);
      const newBlocks = [...blocks];
      const [removed] = newBlocks.splice(draggedIndex, 1);
      newBlocks.splice(targetIndex, 0, removed);
      setBlocks(newBlocks);
    }
  };

  const handleDragEnd = () => {
    setDraggedBlock(null);
  };

  const handleFileImport = (type: CodeType, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (type === 'html') setHtmlCode(content);
        if (type === 'css') setCssCode(content);
        if (type === 'js') setJsCode(content);
        toast({ title: 'Файл загружен', description: `${type.toUpperCase()} файл импортирован` });
      };
      reader.readAsText(file);
    }
  };

  const handlePublish = () => {
    const url = `plutstudio.dev/project/${Math.random().toString(36).substring(7)}`;
    setPublishedUrl(url);
    toast({ 
      title: 'Проект опубликован!', 
      description: `Доступен по ссылке: ${url}` 
    });
  };

  const getCurrentCode = () => {
    if (selectedCode === 'html') return htmlCode;
    if (selectedCode === 'css') return cssCode;
    return jsCode;
  };

  const setCurrentCode = (value: string) => {
    if (selectedCode === 'html') setHtmlCode(value);
    if (selectedCode === 'css') setCssCode(value);
    if (selectedCode === 'js') setJsCode(value);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <header className="bg-white border-b border-gray-200 px-3 md:px-6 py-3 md:py-5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Code2" className="text-white" size={24} />
          </div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900">PlutStudio</h1>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="default" className="relative md:size-lg">
              <Icon name="Menu" size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[85vw] sm:w-[400px]">
            <div className="flex flex-col gap-5 mt-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">Меню</h2>
              <Button variant="ghost" size="default" className="justify-start text-base md:text-lg h-12 md:h-14" onClick={() => document.getElementById('editor-tab')?.click()}>
                <Icon name="Code" className="mr-3" size={24} />
                Редактор
              </Button>
              <Button variant="ghost" size="default" className="justify-start text-base md:text-lg h-12 md:h-14" onClick={() => document.getElementById('blocks-tab')?.click()}>
                <Icon name="Box" className="mr-3" size={24} />
                Конструктор
              </Button>
              <Button variant="ghost" size="default" className="justify-start text-base md:text-lg h-12 md:h-14" onClick={() => document.getElementById('preview-tab')?.click()}>
                <Icon name="Eye" className="mr-3" size={24} />
                Превью
              </Button>
              <Button variant="default" size="default" className="justify-start text-base md:text-lg h-12 md:h-14" onClick={handlePublish}>
                <Icon name="Upload" className="mr-3" size={24} />
                Опубликовать
              </Button>
              <Button variant="ghost" size="default" className="justify-start text-base md:text-lg h-12 md:h-14" asChild>
                <a href="https://t.me/plutstudio" target="_blank" rel="noopener noreferrer">
                  <Icon name="Send" className="mr-3" size={24} />
                  Telegram канал
                </a>
              </Button>
              {publishedUrl && (
                <div className="mt-4 p-5 bg-green-50 border-2 border-green-200 rounded-lg">
                  <p className="text-base font-medium text-green-900 mb-3">Проект опубликован:</p>
                  <p className="text-base text-green-700 break-all">{publishedUrl}</p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 overflow-auto">
        <Tabs defaultValue="editor" className="h-full">
          <TabsList className="mx-3 md:mx-6 mt-3 md:mt-4 w-fit h-10 md:h-11">
            <TabsTrigger value="editor" id="editor-tab" className="text-base px-6">
              <Icon name="Code" className="mr-2" size={20} />
              Редактор
            </TabsTrigger>
            <TabsTrigger value="blocks" id="blocks-tab" className="text-base px-6">
              <Icon name="Box" className="mr-2" size={20} />
              Конструктор
            </TabsTrigger>
            <TabsTrigger value="preview" id="preview-tab" className="text-base px-6">
              <Icon name="Eye" className="mr-2" size={20} />
              Превью
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="px-3 md:px-6 pb-4 md:pb-6 mt-3 md:mt-4 space-y-4 md:space-y-6">
            <Card className="p-3 md:p-5">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-between mb-4 md:mb-5">
                <div className="flex gap-3">
                  <Button 
                    size="default" 
                    variant={selectedCode === 'html' ? 'default' : 'outline'}
                    onClick={() => setSelectedCode('html')}
                    className="text-base"
                  >
                    <Icon name="FileCode" className="mr-2" size={20} />
                    HTML
                  </Button>
                  <Button 
                    size="default" 
                    variant={selectedCode === 'css' ? 'default' : 'outline'}
                    onClick={() => setSelectedCode('css')}
                    className="text-base"
                  >
                    <Icon name="Palette" className="mr-2" size={20} />
                    CSS
                  </Button>
                  <Button 
                    size="default" 
                    variant={selectedCode === 'js' ? 'default' : 'outline'}
                    onClick={() => setSelectedCode('js')}
                    className="text-base"
                  >
                    <Icon name="Braces" className="mr-2" size={20} />
                    JavaScript
                  </Button>
                </div>
                <div className="flex gap-3">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept={selectedCode === 'html' ? '.html' : selectedCode === 'css' ? '.css' : '.js'}
                      className="hidden"
                      onChange={(e) => handleFileImport(selectedCode, e)}
                    />
                    <Button size="lg" variant="outline" asChild className="text-base">
                      <span>
                        <Icon name="Upload" className="mr-2" size={18} />
                        Импорт
                      </span>
                    </Button>
                  </label>
                  <Button size="lg" variant="outline" onClick={refreshPreview} className="text-base">
                    <Icon name="RefreshCw" className="mr-2" size={18} />
                    Обновить
                  </Button>
                </div>
              </div>
              <Textarea
                value={getCurrentCode()}
                onChange={(e) => setCurrentCode(e.target.value)}
                className="flex-1 font-mono text-lg resize-none min-h-0 overflow-auto leading-relaxed p-4"
                placeholder={`Введите ${selectedCode.toUpperCase()} код...`}
              />
            </Card>

            <Card className="flex-1 overflow-hidden flex flex-col min-h-0">
              <div className="p-4 border-b bg-gray-50 flex items-center justify-between flex-shrink-0">
                <span className="text-base font-medium text-gray-700 flex items-center gap-2">
                  <Icon name="Eye" size={20} />
                  Превью
                </span>
                <Button size="default" variant="ghost" onClick={refreshPreview}>
                  <Icon name="RefreshCw" size={18} />
                </Button>
              </div>
              <div className="flex-1 overflow-auto bg-white min-h-0">
                <iframe
                  srcDoc={previewHTML}
                  className="w-full h-full border-none"
                  title="Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="blocks" className="px-3 md:px-6 pb-4 md:pb-6 mt-3 md:mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-8 h-fit">
                <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-5 flex items-center gap-2">
                  <Icon name="Plus" size={22} />
                  Добавить блок
                </h3>
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <Button onClick={() => addBlock('text')} variant="outline" className="h-20 md:h-24 flex flex-col gap-1.5 md:gap-2">
                    <Icon name="Type" className="w-6 h-6 md:w-7 md:h-7" />
                    <span className="text-sm md:text-base">Текст</span>
                  </Button>
                  <Button onClick={() => addBlock('button')} variant="outline" className="h-20 md:h-24 flex flex-col gap-1.5 md:gap-2">
                    <Icon name="RectangleHorizontal" className="w-6 h-6 md:w-7 md:h-7" />
                    <span className="text-sm md:text-base">Кнопка</span>
                  </Button>
                  <Button onClick={() => addBlock('link')} variant="outline" className="h-20 md:h-24 flex flex-col gap-1.5 md:gap-2">
                    <Icon name="Link" className="w-6 h-6 md:w-7 md:h-7" />
                    <span className="text-sm md:text-base">Текст с ссылкой</span>
                  </Button>
                  <Button onClick={() => addBlock('image')} variant="outline" className="h-20 md:h-24 flex flex-col gap-1.5 md:gap-2">
                    <Icon name="Image" className="w-6 h-6 md:w-7 md:h-7" />
                    <span className="text-sm md:text-base">Картинка</span>
                  </Button>
                </div>
                <Button 
                  className="w-full mt-4 md:mt-5 h-11 md:h-12 text-sm md:text-base" 
                  variant="default"
                  onClick={updateHTMLWithBlocks}
                >
                  <Icon name="Code2" className="mr-1.5 md:mr-2" size={16} />
                  Добавить блоки в HTML
                </Button>
              </Card>

              <Card className="p-4 md:p-6 h-fit"
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Icon name="Layers" size={22} />
                    Блоки ({blocks.length})
                  </h3>
                </div>
                <div className="space-y-3 max-h-[500px] overflow-auto">
                  {blocks.map(block => (
                    <Card 
                      key={block.id} 
                      className="p-5 cursor-move hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={() => handleDragStart(block.id)}
                      onDragOver={(e) => handleDragOver(e, block.id)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon name="GripVertical" size={18} className="text-gray-400" />
                          <span className="text-base font-medium text-gray-600 capitalize">{block.type}</span>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => deleteBlock(block.id)}>
                          <Icon name="Trash2" size={18} />
                        </Button>
                      </div>
                      {block.type === 'image' ? (
                        <Input
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, e.target.value)}
                          placeholder="URL изображения"
                          className="text-base h-11"
                        />
                      ) : (
                        <Input
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, e.target.value)}
                          placeholder="Содержимое"
                          className="text-base h-11"
                        />
                      )}
                      {block.type === 'link' && (
                        <Input
                          value={block.href}
                          onChange={(e) => updateBlock(block.id, block.content, e.target.value)}
                          placeholder="https://example.com"
                          className="text-base h-11 mt-2"
                        />
                      )}
                    </Card>
                  ))}
                  {blocks.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                      <Icon name="Box" size={56} className="mx-auto mb-3 opacity-30" />
                      <p className="text-base">Блоки не добавлены</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="px-3 md:px-6 pb-4 md:pb-6 mt-3 md:mt-4">
            <Card className="overflow-hidden">
              <div className="p-3 md:p-4 border-b bg-gray-50 flex items-center justify-between">
                <span className="text-base font-medium text-gray-700">Превью проекта</span>
                <Button size="default" variant="outline" onClick={refreshPreview}>
                  <Icon name="RefreshCw" className="mr-2" size={16} />
                  Обновить
                </Button>
              </div>
              <div className="h-[calc(100vh-180px)] md:h-[calc(100vh-220px)] bg-white">
                <iframe
                  srcDoc={previewHTML}
                  className="w-full h-full border-none"
                  title="Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
              <div className="p-3 border-t bg-gray-50 text-center text-sm text-gray-500">
                PlutStudio
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}