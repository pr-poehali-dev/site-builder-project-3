import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type BlockType = 'text' | 'button' | 'link' | 'image';

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
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [publishedUrl, setPublishedUrl] = useState('');
  const { toast } = useToast();

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? 'Новый текст' : type === 'button' ? 'Кнопка' : type === 'link' ? 'Ссылка' : 'https://via.placeholder.com/300',
      href: type === 'link' ? '#' : undefined
    };
    setBlocks([...blocks, newBlock]);
    toast({ title: 'Блок добавлен', description: `${type} успешно добавлен в конструктор` });
  };

  const updateBlock = (id: string, content: string, href?: string) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content, href } : block
    ));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const handleFileImport = (type: 'html' | 'css' | 'js', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (type === 'html') setHtmlCode(content);
        if (type === 'css') setCssCode(content);
        if (type === 'js') setJsCode(content);
        toast({ title: 'Файл загружен', description: `${type.toUpperCase()} файл успешно импортирован` });
      };
      reader.readAsText(file);
    }
  };

  const handlePublish = () => {
    const url = `plutstudio.dev/project/${Math.random().toString(36).substring(7)}`;
    setPublishedUrl(url);
    toast({ 
      title: 'Проект опубликован!', 
      description: `Ваш проект доступен по ссылке: ${url}` 
    });
  };

  const renderPreview = () => {
    return (
      <div className="w-full h-full bg-white rounded-lg overflow-auto">
        <div className="p-8">
          {blocks.map(block => (
            <div key={block.id} className="mb-4">
              {block.type === 'text' && (
                <p className="text-gray-800">{block.content}</p>
              )}
              {block.type === 'button' && (
                <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  {block.content}
                </button>
              )}
              {block.type === 'link' && (
                <a href={block.href} className="text-primary underline hover:text-primary/80">
                  {block.content}
                </a>
              )}
              {block.type === 'image' && (
                <img src={block.content} alt="Block" className="max-w-full rounded-lg" />
              )}
            </div>
          ))}
        </div>
        <div className="fixed bottom-4 right-4 text-sm text-gray-500 font-medium">
          PlutStudio
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Code2" className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">PlutStudio</h1>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Icon name="Menu" size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 mt-8">
              <h2 className="text-xl font-semibold mb-4">Меню</h2>
              <Button variant="ghost" className="justify-start" onClick={() => document.getElementById('editor-tab')?.click()}>
                <Icon name="Code" className="mr-2" size={20} />
                Редактор
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => document.getElementById('blocks-tab')?.click()}>
                <Icon name="Box" className="mr-2" size={20} />
                Конструктор
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => document.getElementById('preview-tab')?.click()}>
                <Icon name="Eye" className="mr-2" size={20} />
                Превью
              </Button>
              <Button variant="default" className="justify-start" onClick={handlePublish}>
                <Icon name="Upload" className="mr-2" size={20} />
                Опубликовать
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <a href="https://t.me/plutstudio" target="_blank" rel="noopener noreferrer">
                  <Icon name="Send" className="mr-2" size={20} />
                  Telegram канал
                </a>
              </Button>
              {publishedUrl && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-900 mb-2">Проект опубликован:</p>
                  <p className="text-sm text-green-700 break-all">{publishedUrl}</p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 overflow-hidden">
        <Tabs defaultValue="editor" className="h-full flex flex-col">
          <TabsList className="mx-6 mt-4 w-fit">
            <TabsTrigger value="editor" id="editor-tab">
              <Icon name="Code" className="mr-2" size={16} />
              Редактор
            </TabsTrigger>
            <TabsTrigger value="blocks" id="blocks-tab">
              <Icon name="Box" className="mr-2" size={16} />
              Конструктор
            </TabsTrigger>
            <TabsTrigger value="preview" id="preview-tab">
              <Icon name="Eye" className="mr-2" size={16} />
              Превью
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="flex-1 px-6 pb-6 mt-4 overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
              <Card className="p-4 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Icon name="FileCode" size={18} />
                    HTML
                  </h3>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".html"
                      className="hidden"
                      onChange={(e) => handleFileImport('html', e)}
                    />
                    <Button size="sm" variant="outline" asChild>
                      <span>
                        <Icon name="Upload" className="mr-1" size={14} />
                        Импорт
                      </span>
                    </Button>
                  </label>
                </div>
                <Textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  className="flex-1 font-mono text-xs resize-none"
                  placeholder="Введите HTML код..."
                />
              </Card>

              <Card className="p-4 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Icon name="Palette" size={18} />
                    CSS
                  </h3>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".css"
                      className="hidden"
                      onChange={(e) => handleFileImport('css', e)}
                    />
                    <Button size="sm" variant="outline" asChild>
                      <span>
                        <Icon name="Upload" className="mr-1" size={14} />
                        Импорт
                      </span>
                    </Button>
                  </label>
                </div>
                <Textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  className="flex-1 font-mono text-xs resize-none"
                  placeholder="Введите CSS код..."
                />
              </Card>

              <Card className="p-4 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Icon name="Braces" size={18} />
                    JavaScript
                  </h3>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".js"
                      className="hidden"
                      onChange={(e) => handleFileImport('js', e)}
                    />
                    <Button size="sm" variant="outline" asChild>
                      <span>
                        <Icon name="Upload" className="mr-1" size={14} />
                        Импорт
                      </span>
                    </Button>
                  </label>
                </div>
                <Textarea
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  className="flex-1 font-mono text-xs resize-none"
                  placeholder="Введите JS код..."
                />
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="blocks" className="flex-1 px-6 pb-6 mt-4 overflow-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Plus" size={20} />
                  Добавить блок
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={() => addBlock('text')} variant="outline" className="h-20 flex flex-col gap-2">
                    <Icon name="Type" size={24} />
                    <span>Текст</span>
                  </Button>
                  <Button onClick={() => addBlock('button')} variant="outline" className="h-20 flex flex-col gap-2">
                    <Icon name="RectangleHorizontal" size={24} />
                    <span>Кнопка</span>
                  </Button>
                  <Button onClick={() => addBlock('link')} variant="outline" className="h-20 flex flex-col gap-2">
                    <Icon name="Link" size={24} />
                    <span>Текст с ссылкой</span>
                  </Button>
                  <Button onClick={() => addBlock('image')} variant="outline" className="h-20 flex flex-col gap-2">
                    <Icon name="Image" size={24} />
                    <span>Картинка</span>
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Icon name="Layers" size={20} />
                    Блоки ({blocks.length})
                  </h3>
                </div>
                <div className="space-y-3 max-h-96 overflow-auto">
                  {blocks.map(block => (
                    <Card key={block.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600 capitalize">{block.type}</span>
                        <Button size="sm" variant="ghost" onClick={() => deleteBlock(block.id)}>
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                      {block.type === 'image' ? (
                        <Input
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, e.target.value)}
                          placeholder="URL изображения"
                          className="text-sm"
                        />
                      ) : (
                        <Input
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, e.target.value)}
                          placeholder="Содержимое"
                          className="text-sm"
                        />
                      )}
                      {block.type === 'link' && (
                        <Input
                          value={block.href}
                          onChange={(e) => updateBlock(block.id, block.content, e.target.value)}
                          placeholder="https://example.com"
                          className="text-sm mt-2"
                        />
                      )}
                    </Card>
                  ))}
                  {blocks.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Icon name="Box" size={48} className="mx-auto mb-3 opacity-30" />
                      <p>Блоки не добавлены</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 px-6 pb-6 mt-4 overflow-hidden">
            <Card className="h-full p-0 overflow-hidden">
              {renderPreview()}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
