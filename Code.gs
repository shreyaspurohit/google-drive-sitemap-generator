function onOpen(){
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Sitemap')
      .addItem('Generate for My Drive', 'main')
      .addToUi();
}

function main() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt('How many folders deep sitemap do you want to generate?', 'Enter a number > 0', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() == ui.Button.OK) {
    const level = Number(response.getResponseText());
    var row=1, col = 1;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
    // clear the sheet
    sheet.clearContents()
    sheet.clearFormats()
    traverseFolder(null, level, sheet, row, col);
  } else if (response.getSelectedButton() == ui.Button.CANCEL) {
   Logger.log('The user canceled the dialog.');
  } else {
   Logger.log('The user closed the dialog.');
  }
}

function traverseFolder(folder, level, sheet, row, col) {
  //Stop at the depth level as given in input
  if (level <= 0) return {"row": row}; 
  
  folder = folder || DriveApp.getRootFolder();
  var folderName = folder.getName();
  
  // Process folder
  var cell = sheet.getRange(row,col);
  setCell(cell, 'darkblue', '#e7cffc', folder.getUrl(), folderName)
  
  // Process child folders recursively
  var childFolders = folder.getFolders();  
  while (childFolders.hasNext()) {
    newData = traverseFolder(childFolders.next(), level-1, sheet, row, col+1);
    row = newData.row
  }
  col++;
  
  // Process files in folder
  var files = folder.getFiles();
  while (files.hasNext()) {
    var file = files.next();       
    var cell = sheet.getRange(row,col)
    setCell(cell, 'green', '#B2EFAA', file.getUrl(), file.getName())    
    row++;
  }
  return {
    "row": row
  };
}

function setCell(cell, fontColor, backgroundColor, fileUrl, fileName) {
    // cell.setValue(fileName);
    cell.setFontColor(fontColor);
    cell.setBackground(backgroundColor);
    cell.setFormula('=HYPERLINK("' + fileUrl + '","' + fileName + '")');
}
