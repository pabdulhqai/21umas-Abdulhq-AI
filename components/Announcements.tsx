import React from 'react';
import { ExternalLinkIcon } from './Icons.tsx';

const CHANNELS = [
    { name: "المركز الإعلامي", handle: "MUMAS21" },
    { name: "القناة الرسمية للجامعة", handle: "University21September" },
    { name: "كلية الطب البشري", handle: "medi21sept" },
    { name: "كلية علوم المختبرات الطبية", handle: "MedicalLaboratory21" },
    { name: "ملتقى الطالب الجامعي", handle: "USF21" }
];

const Announcements: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-800">
            <div className="p-6 border-b border-slate-700 shrink-0" dir="rtl">
                <h2 className="text-2xl font-bold text-white">إعلانات الجامعة</h2>
                <p className="text-slate-400 mt-1">
                    منشورات وتعميمات مباشرة من قنوات الجامعة الرسمية على تيليجرام.
                </p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {CHANNELS.map(channel => (
                    <div key={channel.handle} className="bg-slate-900 rounded-lg shadow-lg flex flex-col overflow-hidden">
                        <div className="p-4 bg-slate-800/50 border-b border-slate-700" dir="rtl">
                            <h3 className="font-semibold text-white truncate">{channel.name}</h3>
                            <p className="text-sm text-cyan-400">@{channel.handle}</p>
                        </div>
                        <div className="flex-1 bg-slate-950 p-6 flex flex-col justify-center items-center text-center" dir="rtl">
                            <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mb-4 border border-cyan-500/20">
                                <ExternalLinkIcon className="w-8 h-8 text-cyan-400" />
                            </div>
                            <h4 className="font-semibold text-slate-200 mb-2">عرض المنشورات على تيليجرام</h4>
                            <p className="text-sm text-slate-400 mb-6">
                                بسبب قيود تقنية من تيليجرام، يجب فتح القناة لعرض محتواها.
                            </p>
                            <a 
                                href={`https://t.me/${channel.handle}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center gap-2 text-center px-4 py-3 text-sm font-semibold bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors text-white shadow-lg"
                                aria-label={`Open ${channel.name} on Telegram`}
                            >
                                فتح القناة
                                <ExternalLinkIcon className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Announcements;