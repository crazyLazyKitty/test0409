import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { SlidersHorizontal } from 'lucide-react';
import api from '@/api';
import Loading from '../loading';

const ChapterSettingsDialog = ({ unitId }: { unitId: string }) => {
    const [open, setOpen] = useState(false);
    const [chapterType, setChapterType] = useState("normal");
    const [systemPrompt, setSystemPrompt] = useState("");
    const [hideChapter, setHideChapter] = useState(true);
    const [loading, setLoading] = useState(false);
    const onConfirm = async () => {
        await api.modifyUnit({
            // "unit_description": "string",
            "unit_id": unitId,
            // "unit_index": 0,
            "unit_is_hidden": hideChapter,
            // "unit_name": "string",
            "unit_system_prompt": systemPrompt,
            "unit_type": chapterType
        })
        setOpen(false);
    }
    const init = async () => {
        setOpen(true);
        setLoading(true);
        const result = await api.getUnitInfo({
            unit_id: unitId
        })
        setChapterType(result.type);
        setSystemPrompt(result.system_prompt);
        setHideChapter(result.is_hidden);
        setLoading(false);
    }
    useEffect(() => {
        if (!open) {
            setChapterType("formal");
            setSystemPrompt("");
            setHideChapter(true);
        } else {
            init();
        }
    }, [open, unitId])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <SlidersHorizontal className='cursor-pointer h-4 w-4 text-gray-500' />
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-gray-100">
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium">章节设置</DialogTitle>
                </DialogHeader>
                {
                    loading && (
                        <div className='flex justify-center items-center h-24'>
                            <Loading />
                        </div>

                    )
                }
                {
                    !loading && (
                        <div className="space-y-6 py-4">
                            {/* Chapter Type */}
                            <div className="flex items-center space-x-4">
                                <div className="w-24 text-sm">章节类型</div>
                                <RadioGroup
                                    value={chapterType}
                                    onValueChange={setChapterType}
                                    className="flex space-x-6"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="normal" id="formal" />
                                        <Label htmlFor="formal">正式章节</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="trial" id="trial" />
                                        <Label htmlFor="trial">试用章节</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* System Prompt */}
                            <div className="flex space-x-4">
                                <div className="w-24 text-sm mt-2">系统提示词</div>
                                <Textarea
                                    placeholder="请输入xxx"
                                    value={systemPrompt}
                                    onChange={(e) => setSystemPrompt(e.target.value)}
                                    className="h-24 bg-white"
                                />
                            </div>

                            {/* Hide Chapter */}
                            <div className="flex items-center space-x-4">
                                <div className="w-24 text-sm">是否隐藏</div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="hideChapter"
                                        checked={hideChapter}
                                        onCheckedChange={setHideChapter as any}
                                    />
                                    <Label htmlFor="hideChapter">隐藏章节</Label>
                                </div>
                            </div>
                        </div>
                    )
                }
                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        取消
                    </Button>
                    <Button disabled={loading} onClick={onConfirm}>
                        确定
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default ChapterSettingsDialog;
