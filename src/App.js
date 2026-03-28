import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Sidebar, Header, MissionControl, PayloadFactory, MultiStageAccess, Infrastructure } from './components';
export default function App() {
    const [currentView, setCurrentView] = useState('mission-control');
    const renderView = () => {
        switch (currentView) {
            case 'mission-control':
                return _jsx(MissionControl, {});
            case 'payload-factory':
                return _jsx(PayloadFactory, {});
            case 'multi-stage':
                return _jsx(MultiStageAccess, {});
            case 'infrastructure':
                return _jsx(Infrastructure, {});
            default:
                return _jsx(MissionControl, {});
        }
    };
    const getViewTitle = () => {
        switch (currentView) {
            case 'mission-control':
                return 'Mission Control';
            case 'payload-factory':
                return 'Payload Factory';
            case 'multi-stage':
                return 'Multi-Stage Access';
            case 'infrastructure':
                return 'Infrastructure';
            default:
                return 'Mission Control';
        }
    };
    return (_jsxs("div", { className: "flex h-screen bg-charcoal", children: [_jsx(Sidebar, { currentView: currentView, onViewChange: setCurrentView }), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsx(Header, { title: getViewTitle() }), _jsx("main", { className: "flex-1 overflow-auto bg-charcoal", children: _jsx("div", { className: "p-8", children: renderView() }) })] })] }));
}
