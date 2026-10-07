const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
 const page=await browser.newPage();
 await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);
 const click=a=>page.locator(`[data-action="${a}"]`).click();
 await page.locator('.product[data-id="coffee"]').click();
 await click('review');await click('methods');
 for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:1000});
  for(const method of ['cash','qr','card']){
   await click(method);
   assert.equal(await page.locator('.method.is-selected').getAttribute('data-action'),method);
   assert.equal(await page.locator('.method.is-selected').getAttribute('aria-pressed'),'true');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   if(process.env.QA_DIR)await page.screenshot({path:path.join(process.env.QA_DIR,`${method}-${width}.png`),fullPage:true,animations:"disabled"});
  }
 }
 await click('cash');
 for(const key of ['5','0','.','2','5','9'])await page.locator(`[data-action="key"][data-value="${key}"]`).click();
 assert.equal(await page.locator('#cash').inputValue(),'50.25');
 await page.locator('[data-value="backspace"]').click();
 assert.equal(await page.locator('#cash').inputValue(),'50.2');
 await click('clear');await page.locator('#cash').fill('20');
 assert.match(await page.locator('#cash-error').textContent(),/short by/);
 await click('review');assert.match(await page.locator('.total').textContent(),/45.00/);
 await click('methods');await click('cash');assert.equal(await page.locator('#cash').inputValue(),'');
 for(const [method,action] of [['cash','pay'],['qr','confirm'],['card','process']]){
  await click(method);
  if(method==='cash')await page.locator('[data-action="quick"]').first().click();
  await click(action);
  assert.equal(await page.locator('.payment-status').isVisible(),true);
  assert.equal(await page.locator('.payment-panel button:not(:disabled)').count(),0);
  // Synthetic repeated clicks must also be ignored while the transaction is pending.
  await page.locator(`[data-action="${action}"]`).evaluate(b=>b.dispatchEvent(new MouseEvent('click',{bubbles:true})));
  await page.waitForSelector('[data-action="receipt"]');
  assert.equal(await page.locator('.reference').count(),1);
  await click('receipt');await click('reset');
  await page.locator('.product[data-id="coffee"]').click();await click('review');await click('methods');
 }
 console.log('PASS: selected methods, payment responsiveness, keypad precision/backspace, live shortage, navigation/cart preservation, processing and duplicate-click guards for all methods.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
