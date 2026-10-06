import { MessageCircle } from "lucide-react";

const SMSBalance = () => {
    return (
        <div className="px-4 mb-6">
            <div className="bg-white rounded-xl p-4">
                <div className="flex items-center mb-2">
                    <MessageCircle size={16} className="text-[color:var(--color-navy-blue)] mr-2" />
                    <span className="text-sm font-medium text-[color:var(--color-navy-blue)]">SMS Balance</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[color:var(--color-navy-blue)]">2,888</span>
                    <button className="px-2 py-1 bg-[color:var(--color-dark-blue)] text-white text-xs rounded-lg">Recharge</button>
                </div>
            </div>
        </div>
    );
};

export default SMSBalance;