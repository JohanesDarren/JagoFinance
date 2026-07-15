import re

with open("src/components/WebDashboard.tsx", "r", encoding="utf-8") as f:
    content = f.read()

main_replacement = """
          {/* SKELETON LOADING STATE */}
          {isLoading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-white border border-slate-100 rounded-2xl shimmer-active"></div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 h-72 bg-white border border-slate-100 rounded-2xl shimmer-active"></div>
                <div className="h-72 bg-white border border-slate-100 rounded-2xl shimmer-active"></div>
              </div>
            </div>
          ) : (
            <>
              {/* === SUPER ADMIN SCREENS === */}
              {userRole === 'super_admin' && activeTab === 'overview' && (
                <OverviewScreenSuperAdmin {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals
                }} />
              )}
              {userRole === 'super_admin' && activeTab === 'subscriptions' && (
                <SubscriptionsScreen {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals
                }} />
              )}
              {userRole === 'super_admin' && activeTab === 'integrations' && (
                <IntegrationsScreen {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals
                }} />
              )}

              {/* === ADMIN CABANG SCREENS === */}
              {userRole !== 'super_admin' && activeTab === 'overview' && (
                <OverviewScreenAdmin {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals
                }} />
              )}
              {userRole !== 'super_admin' && activeTab === 'approvals' && (
                <ApprovalsScreen {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals
                }} />
              )}
              {userRole !== 'super_admin' && activeTab === 'inbound' && (
                <InboundScreen {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals
                }} />
              )}
              {userRole !== 'super_admin' && activeTab === 'ledger' && (
                <LedgerScreen {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals
                }} />
              )}
              {userRole !== 'super_admin' && activeTab === 'payroll' && (
                <PayrollScreen {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals
                }} />
              )}

              {/* === SHARED SCREENS === */}
              {activeTab === 'profile' && (
                <ProfileScreen {...{
                  transactions, cashBalance, employees, connectedApps, subscriptions, onRefreshData,
                  onApprove, onReject, onManualLedger, onToggleApp, onWebhookSave, onPayrollGenerate,
                  isLoading, onLogout, onInviteEmployee, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
                  categoryFilter, setCategoryFilter, splitViewTx, setSplitViewTx, rejectReasonText,
                  setRejectReasonText, showRejectForm, setShowRejectForm, showManualModal, setShowManualModal,
                  showWebhookModal, setShowWebhookModal, selectedLedgerReceipt, setSelectedLedgerReceipt,
                  approveRecipientName, setApproveRecipientName, approveBankName, setApproveBankName,
                  approveBankAccount, setApproveBankAccount, approveReceiptBase64, setApproveReceiptBase64,
                  isDragging, setIsDragging, webhookUrl, setWebhookUrl, webhookGateway, setWebhookGateway,
                  manualMerchant, setManualMerchant, manualCategory, setManualCategory, manualType, setManualType,
                  manualAmount, setManualAmount, manualNotes, setManualNotes, manualReceiptBase64, setManualReceiptBase64,
                  isDraggingManual, setIsDraggingManual, payrollDivision, setPayrollDivision, payrollMessage,
                  setPayrollMessage, errorMessage, setErrorMessage, totalInflowThisMonth, totalOutflowThisMonth,
                  averageMonthlyBurn, runwayMonths, categorySummary, categoryEntries, totalExpenseAllocated,
                  handleExportCSV, isSubmittingApproval, handleApproveAction, handleRejectAction, handleManualPost,
                  handleSaveWebhook, handleMassPayroll, openWebhookSetup, pendingApprovals
                }} />
              )}
            </>
          )}
"""

start_index = content.find('{/* SKELETON LOADING STATE */}')
end_index = content.find('</>', start_index) + 3
end_index = content.find(')}', end_index) + 2

if start_index != -1 and end_index != -1:
    new_content = content[:start_index] + main_replacement.strip() + content[end_index:]
    with open("src/components/WebDashboard.tsx", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Replaced main screens successfully")
else:
    print("Could not find main element")
