import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';

test('メニューが表示される', () => {
  render(<Dashboard />);

  const addDataElement = screen.getByText('データを追加')
  expect( addDataElement ).toBeInTheDocument()

  const seeAnalysisButtonElement = screen.getByRole('button', { name: '分析結果' } )
  expect( seeAnalysisButtonElement ).toBeInTheDocument()
});

test('メニューで画面の切り替えができる', () => {
  render(<Dashboard />);

  expect( screen.queryByTestId('addform') ).toBeInTheDocument()
  expect( screen.queryByTitle('doubles') ).not.toBeInTheDocument()
  
  const analysisButton = screen.getByText('分析結果')
  const adddataButton = screen.getByText('データを追加')

  analysisButton.click()
  expect( screen.queryByTestId('addform') ).not.toBeInTheDocument()
  expect( screen.queryByTitle('doubles') ).toBeInTheDocument()

  adddataButton.click()
  expect( screen.queryByTestId('addform') ).toBeInTheDocument()
  expect( screen.queryByTitle('doubles') ).not.toBeInTheDocument()
  
});

test('登録フォームが表示される', () => {
  render(<Dashboard />);

  const titleElement = screen.getByRole( 'title' )
  expect(titleElement).toBeInTheDocument()

  const rawdataElement = screen.getByRole('rawdata')
  expect( rawdataElement ).toBeInTheDocument()

  const registerButton = screen.getByRole('adddata')
  expect( registerButton ).toBeInTheDocument()

});


test('連番データを登録できる', () => {
  
  render(<Dashboard />);
  const titleElement = screen.getByRole('title').querySelector('input')
  const rawdataElement = screen.getByRole('rawdata').querySelector('textarea')
  const addDataButton = screen.getByRole('adddata')
  
  expect( screen.queryByRole('data-0') ).not.toBeInTheDocument()

  fireEvent.change( titleElement, { target: { value: 'あいうえお' }  })
  fireEvent.change( rawdataElement, { target: { value: "1\t5" }  })
  
  addDataButton.click()
  expect( screen.queryByTitle('data-0') ).toBeInTheDocument()
  expect( screen.queryByRole('savedMenuItem')).toHaveTextContent('あいうえお')
  expect( screen.queryByTestId('addform') ).not.toBeInTheDocument()
  expect( screen.queryByTestId('analysis') ).not.toBeInTheDocument()
  expect( screen.queryByTitle('dataview') ).toBeInTheDocument()

  expect( screen.queryByTitle('dataview') ).toHaveTextContent("あいうえお")
  expect( screen.queryByTitle('dataview') ).toHaveTextContent("1")
  expect( screen.queryByTitle('dataview') ).toHaveTextContent("5")
  expect( screen.queryByTitle('dataview') ).toHaveTextContent("1, 2, 3, 4, 5")

});

test('飛び番号のデータを登録できる', () => {
  
  render(<Dashboard />);
  const titleElement = screen.getByRole('title').querySelector('input')
  const rawdataElement = screen.getByRole('rawdata').querySelector('textarea')
  const addDataButton = screen.getByRole('adddata')

  fireEvent.change( titleElement, { target: { value: 'あいうえお' }  })
  fireEvent.change( rawdataElement, { target: { value: "1\t5\t100,103,105" }  })
  
  addDataButton.click()
  expect( screen.queryByTitle('dataview') ).toHaveTextContent("100, 103, 105")

});

test('空行はinfoが出る', () => {
  
  render(<Dashboard />);

  fireEvent.change( screen.getByRole('title').querySelector('input'), { target: { value: 'あいうえお' }  })
  fireEvent.change( screen.getByRole('rawdata').querySelector('textarea') , { target: { value: "1\t5\t100,103,105\n\n8\t9" }  })
  
  screen.getByRole('adddata').click()
  expect( screen.queryByTitle('dataview') ).toHaveTextContent("100, 103, 105")
  expect( screen.queryByTitle('dataview') ).toHaveTextContent("null")
  expect( screen.queryByTitle('dataview') ).toHaveTextContent("8, 9")

});

test('範囲指定で数字以外は警告が出る', () => {

  render(<Dashboard />);

  fireEvent.change( screen.getByRole('title').querySelector('input'), { target: { value: 'あいうえお' }  })
  fireEvent.change( screen.getByRole('rawdata').querySelector('textarea') , { target: { value: "あいうえお\tかきくけこ\tさしすせそ\n" }  })
  
  screen.getByRole('adddata').click()
  expect( screen.queryByTitle('dataview') ).toHaveTextContent("数字ではない")

});

test('singlesで数字以外は警告が出る', () => {
  
  render(<Dashboard />);

  fireEvent.change( screen.getByRole('title').querySelector('input'), { target: { value: 'あいうえお' }  })
  fireEvent.change( screen.getByRole('rawdata').querySelector('textarea') , { target: { value: "1\t10\tあかさたな\n" }  })
  
  screen.getByRole('adddata').click()
  expect( screen.queryByTitle('dataview') ).toHaveTextContent("数字ではない")

});

test('範囲指定で最初の数字より最後の数字が小さいと警告が出る', () => {
  
  render(<Dashboard />);

  fireEvent.change( screen.getByRole('title').querySelector('input'), { target: { value: 'あいうえお' }  })
  fireEvent.change( screen.getByRole('rawdata').querySelector('textarea') , { target: { value: "5\t3" }  })
  
  screen.getByRole('adddata').click()
  expect( screen.queryByTitle('dataview') ).toHaveTextContent("最初の数字が大きい")

});


test('複数のデータを登録して、それぞれをメニューから選択できる', () => {
  
  render(<Dashboard />);

  fireEvent.change( screen.getByRole('title').querySelector('input'), { target: { value: 'あいうえお' }  })
  fireEvent.change( screen.getByRole('rawdata').querySelector('textarea') , { target: { value: "1000\t1003" }  })
  screen.getByRole('adddata').click()
  expect( screen.queryByTitle('dataview') ).toHaveTextContent("1000, 1001, 1002, 1003")

  screen.getByText('データを追加').click()

  fireEvent.change( screen.getByRole('title').querySelector('input'), { target: { value: 'かきくけこ' }  })
  fireEvent.change( screen.getByRole('rawdata').querySelector('textarea') , { target: { value: "\t\t50,55,30" }  })
  screen.getByRole('adddata').click()
  expect( screen.queryByTitle('dataview') ).toHaveTextContent("50, 55, 30")

  screen.getByText('あいうえお').click()
  expect( screen.queryByTitle('dataview') ).toHaveTextContent("1000, 1001, 1002, 1003")

  screen.getByText('かきくけこ').click()
  expect( screen.queryByTitle('dataview') ).toHaveTextContent("50, 55, 30")
  
});

test('同じセット内での重複を抽出できる', () => {

  render(<Dashboard />);

  fireEvent.change( screen.getByRole('title').querySelector('input'), { target: { value: 'あいうえお' }  })
  fireEvent.change( screen.getByRole('rawdata').querySelector('textarea') , { target: { value: "1000\t1003\n105\t107\t1001,107\n\t\t1002\n\t\t107" }  })
  screen.getByRole('adddata').click()
  expect( screen.queryByTitle('dataview') ).toHaveTextContent("1000, 1001, 1002, 1003")
  expect( screen.queryByTitle('dataview') ).toHaveTextContent("105, 106, 107")
  expect( screen.queryByTitle('dataview') ).toHaveTextContent("1001, 107" )
  expect( screen.queryByTitle('dataview') ).toHaveTextContent("107" )

  screen.getByText('分析結果').click()
  expect( screen.getByTitle('doubles') ).toHaveTextContent( '1-3 of 3' )
  expect( screen.getByTitle('doubles') ).toHaveTextContent( '107' )
  expect( screen.getByTitle('doubles') ).toHaveTextContent( '[あいうえお]で3回出現' )
  expect( screen.getByTitle('doubles') ).toHaveTextContent( '1001' )
  expect( screen.getByTitle('doubles') ).toHaveTextContent( '[あいうえお]で2回出現' )

});

test('複数セットを跨いだ重複を抽出できる', () => {

  render(<Dashboard />);

  fireEvent.change( screen.getByRole('title').querySelector('input'), { target: { value: 'あいうえお' }  })
  fireEvent.change( screen.getByRole('rawdata').querySelector('textarea') , { target: { value: "1000\t1003\t1003" } } )
  screen.getByRole('adddata').click()
  expect( screen.queryByTitle('dataview') ).toHaveTextContent("1000, 1001, 1002, 1003")

  screen.getByText('データを追加').click()

  fireEvent.change( screen.getByRole('title').querySelector('input'), { target: { value: 'かきくけこ' }  })
  fireEvent.change( screen.getByRole('rawdata').querySelector('textarea') , { target: { value: "100\t105\t1002" } } )
  screen.getByRole('adddata').click()
  expect( screen.queryByTitle('dataview') ).toHaveTextContent("100, 101, 102, 103, 104, 105, 1002")

  screen.getByText('分析結果').click()
  
  expect( screen.getByTitle('doubles') ).toHaveTextContent( '1-2 of 2' )
  expect( screen.getByTitle('doubles') ).toHaveTextContent( '1002' )
  expect( screen.getByTitle('doubles') ).toHaveTextContent( '[あいうえお]で出現' )
  expect( screen.getByTitle('doubles') ).toHaveTextContent( '[かきくけこ]で出現' )

  expect( screen.getByTitle('doubles') ).toHaveTextContent( '1003' )
  expect( screen.getByTitle('doubles') ).toHaveTextContent( '[あいうえお]で2回出現' )
});

