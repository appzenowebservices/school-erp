"use client";
import React from "react";
import { X, Save, BookOpen, Target, AlertCircle, Plus, Edit2, Trash2, Check } from "lucide-react";

export const TestModal = ({
  selectedSubject 
}) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Test Configuration</h2>
            <p className="text-gray-500">{selectedSubject?.name} - Configure all tests and weightages</p>
          </div>
        </div>
        <button
          onClick={() => setShowTestModal(false)}
          className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
        <div className="flex items-center gap-3 mb-3">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-blue-900">Test Structure Overview</span>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{selectedSubject?.tests?.length || 0}</div>
            <div className="text-sm text-blue-800">Total Tests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {selectedSubject?.tests?.reduce((sum, test) => sum + test.weightage, 0)}%
            </div>
            <div className="text-sm text-purple-800">Total Weightage</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {selectedSubject?.tests?.reduce((sum, test) => sum + test.maxMarks, 0)}
            </div>
            <div className="text-sm text-green-800">Total Marks</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Test Details</h3>
        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 font-medium">
          <Plus className="w-5 h-5" />
          Add New Test
        </button>
      </div>

      <div className="grid gap-6">
        {selectedSubject?.tests?.map((test, index) => (
          <div key={test.id} className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${getGradientClass(index)} rounded-xl flex items-center justify-center text-white text-lg font-bold`}>
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{test.name}</h4>
                  <p className="text-gray-500">Assessment Configuration</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="text-blue-600 text-sm font-semibold mb-2">Max Marks</div>
                <div className="text-2xl font-bold text-blue-900">{test.maxMarks}</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div className="text-green-600 text-sm font-semibold mb-2">Pass Marks</div>
                <div className="text-2xl font-bold text-green-900">{test.passMarks}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div className="text-purple-600 text-sm font-semibold mb-2">Weightage</div>
                <div className="text-2xl font-bold text-purple-900">{test.weightage}%</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                <div className="text-emerald-600 text-sm font-semibold mb-2">Status</div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-900">Active</span>
                </div>
              </div>
            </div>

            {/* Progress bar for weightage */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Contribution to Total</span>
                <span className="font-semibold">{test.weightage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-gradient-to-r ${getGradientClass(index)} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${test.weightage}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4 pt-8 border-t mt-8">
        <button
          onClick={() => setShowTestModal(false)}
          className="px-6 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-colors"
        >
          Close
        </button>
        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 font-medium">
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>
    </div>
  </div>
);